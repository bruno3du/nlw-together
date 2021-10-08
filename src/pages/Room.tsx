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

type RoomParams = {
	id: string;
};

export default function Room() {
	const { user } = useAuth();
	const params = useParams<RoomParams>();
	const roomId = params.id;
	const [newQuestion, setNewQuestion] = useState('');

	async function handleSendQuestion(e: FormEvent) {
		e.preventDefault()

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

		setNewQuestion('')
	}

	return (
		<div id='page-room'>
			<header>
				<div className='content'>
					<img src={logoImg} alt='Letmeask' />
					<RoomCode code={roomId} />
				</div>
			</header>

			<main>
				<div className='room-title'>
					<h1>Sala React</h1>
					<span>4 Perguntas</span>
				</div>

				<form onSubmit={handleSendQuestion}>
					<textarea
						value={newQuestion}
						onChange={(e) => setNewQuestion(e.target.value)}
						placeholder='O que você quer perguntar?'
					/>

					<div className='form-footer'>
						{ user ? (
							<div className="user-info">
								<img src={user.avatar} alt={user.name} />
								<span>{user.name}</span>
							</div>
						) : (
						<span>
							Para enviar uma pergunta <button>faça seu login</button>.
						</span>
						) }
						<Button type='submit' disabled={!user}>Enviar Pergunta</Button>
					</div>
				</form>
			</main>
		</div>
	);
}
