/** @format */

import logoImg from '../assets/images/logo.svg';
import Button from '../components/Button';
import RoomCode from '../components/RoomCode';
import '../styles/room.scss';
import { useParams, useHistory } from 'react-router-dom';
// import { useAuth } from '../hooks/useAuth';
import Question from '../components/Question';
import { useRoom } from '../hooks/useRoom';
import deleteImg from '../assets/images/delete.svg';
import { database } from '../services/firebase';
import { ref, remove, update } from '@firebase/database';

type RoomParams = {
	id: string;
};

export default function AdminRoom() {
	// const { user } = useAuth();
	const params = useParams<RoomParams>();
	const roomId = params.id;
	const history = useHistory()

	const { questions, title } = useRoom(roomId);

	async function handleDeleteQuestion(questionId: string) {
		if (window.confirm('Tem certeza que quer excluir esta pergunta?')) {
			const questionRef = await ref(
				database,
				`/rooms/${roomId}/questions/${questionId}/`
			);
			remove(questionRef);
		}
	}

	async function handleEndRoom() {
		const updateRoom = await ref(database, `/rooms/${roomId}`);
		update(updateRoom, {
			endedAt: new Date(),
		});
		history.push('/')
	}

	return (
		<div id='page-room'>
			<header>
				<div className='content'>
					<img src={logoImg} alt='Letmeask' />
					<div>
						<RoomCode code={roomId} />
						<Button isOutlined onClick={handleEndRoom}>
							Encerrar Sala
						</Button>
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
								author={question.author}>
								<button
									type='button'
									onClick={() => handleDeleteQuestion(question.id)}>
									<img src={deleteImg} alt='Remover pergunta' />
								</button>
							</Question>
						);
					})}
				</div>
			</main>
		</div>
	);
}
