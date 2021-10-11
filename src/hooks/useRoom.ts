/** @format */

import { onValue, ref } from '@firebase/database';
import { useEffect, useState } from 'react';
import { database } from '../services/firebase';

type QuestionType = {
	id: string;
	author: {
		name: string;
		avatar: string;
	};
	content: string;
	isAnswered: false;
	isHighlighted: false;
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
	}
>;

export function useRoom(roomId: string) {
	const [questions, setQuestions] = useState<QuestionType[]>([]);
	const [title, setTitle] = useState('');

  useEffect(() => {
		const roomRef = ref(database, `/rooms/${roomId}`);
		onValue(roomRef, (snapshot) => {
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
					};
				}
			);

			setTitle(data.title);
			setQuestions(parsedQueries);
		});
	}, [roomId]);


  return { questions, title}
}


 