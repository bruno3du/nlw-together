/** @format */

import { onValue, ref } from '@firebase/database';
import { useEffect, useState } from 'react';
import { database } from '../services/firebase';
import { useAuth } from './useAuth';

type QuestionType = {
	id: string;
	author: {
		name: string;
		avatar: string;
	};
	content: string;
	isAnswered: false;
	isHighlighted: false;
	likeCount: number;
	likeId: string | undefined;
};

type FirebaseQuestions = Record<
	string,
	{
		author: {
			name: string;
			avatar: string;
		};
		content: string;
		isAnswered: false;
		isHighlighted: false;
		likes: Record<
			string,
			{
				authorId: string;
			}
		>;
	}
>;

export function useRoom(roomId: string) {
	const { user } = useAuth();
	const [questions, setQuestions] = useState<QuestionType[]>([]);
	const [title, setTitle] = useState('');

	useEffect(() => {
		const roomRef = ref(database, `/rooms/${roomId}`);
		const listener = onValue(roomRef, (snapshot) => {
			const data = snapshot.val();
			const firebaseQuestions: FirebaseQuestions = data.questions ?? {};
			const parsedQueries = Object.entries(firebaseQuestions).map(
				([key, value]) => {
					return {
						id: key,
						content: value.content,
						author: value.author,
						isHighlighted: value.isHighlighted,
						isAnswered: value.isAnswered,
						likeCount: Object.values(value.likes ?? {}).length,
						likeId: Object.entries(value.likes ?? {}).find(
							([key,like]) => like.authorId === user?.id
						)?.[0],
					};
				}
			);

			setTitle(data.title);
			setQuestions(parsedQueries);

			return () => {
				listener()
			};
		});
	}, [roomId, user?.id]);

	return { questions, title };
}
