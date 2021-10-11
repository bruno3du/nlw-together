/** @format */

import logoImg from '../assets/images/logo.svg';
import Button from '../components/Button';
import RoomCode from '../components/RoomCode';
import '../styles/room.scss';
import { useParams } from 'react-router-dom';
import { FormEvent, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { database } from '../services/firebase';
import { push, ref } from '@firebase/database';
import Question from '../components/Question';
import { useRoom } from '../hooks/useRoom';

type RoomParams = {
	id: string;
};

export default function AdminRoom() {
	const { user } = useAuth();
	const params = useParams<RoomParams>();
	const roomId = params.id;
	const [newQuestion, setNewQuestion] = useState('');
	const { questions, title } = useRoom(roomId);

	async function handleSendQuestion(e: FormEvent) {
		e.preventDefault();

		if (newQuestion.trim() === '') {
			return;
		}

		if (!user) {
			throw new Error('You must be logged in');
		}

		const question = {
			content: newQuestion,
			author: {
				name: user.name,
				avatar: user.avatar,
			},

			isHighlighted: false,
			isAnswered: false,
		};

		const refDb = await ref(database, `/rooms/${roomId}/questions`);
		await push(refDb, question);

		setNewQuestion('');
	}

	return (
		<div id='page-room'>
			<header>
				<div className='content'>
					<img src={logoImg} alt='Letmeask' />
					<div>
						<RoomCode code={roomId} />
						<Button isOutlined>Encerrar Sala</Button>
					</div>
				</div>
			</header>

			<main>
				<div className='room-title'>
					<h1>Sala {title}</h1>
					{questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
				</div>

				<div className='question-list'>
					{questions.map((question) => {
						return (
							<Question
								key={question.id}
								content={question.content}
								author={question.author}
							/>
						);
					})}
				</div>
			</main>
		</div>
	);
}
