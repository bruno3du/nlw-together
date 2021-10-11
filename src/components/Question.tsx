/** @format */

import '../styles/question.scss';
import { ReactNode } from 'react';

type QuestionProps = {
	content: string;
	author: {
		name: string;
		avatar: string;
	};
	children?: ReactNode;
};

export default function Question({ content, author, children }: QuestionProps) {
	return (
		<div className='question'>
			<p>{content}</p>
			<footer>
				<div className='user-info'>
					<img src={author.avatar} alt={author.name} />
					<span>{author.name}</span>
					<div>{children}</div>
				</div>
			</footer>
		</div>
	);
}
