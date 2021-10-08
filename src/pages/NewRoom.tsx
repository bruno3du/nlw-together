/** @format */
import illustration from '../assets/images/illustration.svg';
import logo from '../assets/images/logo.svg';
import '../styles/auth.scss';
import Button from '../components/Button';
import { Link, useHistory } from 'react-router-dom';
import { FormEvent, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { database } from '../services/firebase';
import { push, ref } from '@firebase/database';

export default function NewRoom() {
	const history = useHistory();
	const [newRoom, setNewRoom] = useState('');
	const { user } = useAuth();

	async function handleCreateRoom(e: FormEvent) {
		e.preventDefault();

		if (newRoom.trim() === '') {
			return;
		}
		const roomRef = ref(database, 'rooms');
		const firebaseRoom = await push(roomRef, {
			title: newRoom,
			authorID: user?.id,
		});

		history.push(`/rooms/${firebaseRoom.key}`);
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
					<h1>{user?.name}</h1>
					<h2>Criar uma nova sala</h2>
					<form onSubmit={handleCreateRoom}>
						<input
							value={newRoom}
							onChange={(e) => setNewRoom(e.target.value)}
							type='text'
							placeholder='Nome da sala'
						/>
						<Button type='submit'>Criar sala</Button>
					</form>
					<p>
						quer entrar em uma sala existente? <Link to='/'>clique aqui</Link>{' '}
					</p>
				</div>
			</main>
		</div>
	);
}
