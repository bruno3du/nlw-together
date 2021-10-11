/** @format */
import { useHistory } from 'react-router-dom';
import illustration from '../assets/images/illustration.svg';
import logo from '../assets/images/logo.svg';
import googleIcon from '../assets/images/google-icon.svg';
import '../styles/auth.scss';
import Button from '../components/Button';

import { useAuth } from '../hooks/useAuth';
import { FormEvent, useState } from 'react';
import { get, ref } from '@firebase/database';
import { database } from '../services/firebase';

export default function Home() {
	const { signInWithGoogle, user } = useAuth();
	const history = useHistory();
	const [roomCode, setRoomCode] = useState('');

	async function handleCreateRoom() {
		if (!user) {
			await signInWithGoogle();
		}
		history.push('/rooms/new');
	}

	async function handleJoinRoom(e: FormEvent) {
		e.preventDefault();
		if (roomCode.trim() === '') {
			return;
		}

		const dbRef = await ref(database, `/rooms/${roomCode}`);
		const getRoom = await get(dbRef);

		if (!getRoom.exists()) {
			alert('Room does not exists')
			return;
		}

		history.push(`/rooms/${roomCode}`);
	}
	return (
		<div id='page-auth'>
			<aside>
				<img src={illustration} alt='illustration' />
				<strong>Crie salas de Q&amp;A ao vivo</strong>
				<p>Tire as dúvidas da sua audiciência em tempo real</p>
			</aside>
			<main>
				<div className='main-content'>
					<img src={logo} alt='letmeask' />
					<button onClick={handleCreateRoom} className='create-room'>
						<img src={googleIcon} alt='googleIcon' />
						Crie sua sala com o Google
					</button>
					<div className='separator'>ou entre em uma sala</div>
					<form onSubmit={handleJoinRoom}>
						<input
							value={roomCode}
							onChange={(e) => setRoomCode(e.target.value)}
							type='text'
							placeholder='Digite o código da sala'
						/>
						<Button type='submit'>Entrar na sala</Button>
					</form>
				</div>
			</main>
		</div>
	);
}
