/** @format */

import { GoogleAuthProvider, signInWithPopup } from '@firebase/auth';
import { createContext, ReactNode, useState, useEffect } from 'react';
import { auth } from '../services/firebase';

type User = {
	id: string;
	name: string;
	avatar: string;
};

type AuthContextType = {
	user: User | undefined;
	signInWithGoogle: () => Promise<void>;
};

type AuthContextProviderProps = {
	children: ReactNode;
};
export const AuthContext = createContext({} as AuthContextType);

export default function AuthContextProvider(props: AuthContextProviderProps) {
	useEffect(() => {
		const unsubscribe = auth.onAuthStateChanged((user) => {
			if (user) {
				const { displayName, photoURL, uid } = user;

				if (!displayName || !photoURL) {
					throw new Error('Missing information from Google Account.');
				}

				setUser({
					id: uid,
					name: displayName,
					avatar: photoURL,
				});
			}
		});

		return () => {
			unsubscribe();
		};
	}, []);
	const [user, setUser] = useState<User>();

	async function signInWithGoogle() {
		const provider = new GoogleAuthProvider();
		provider.addScope('profile');
		provider.addScope('email');
		const result = await signInWithPopup(auth, provider);
		if (result) {
			const { displayName, photoURL, uid } = result.user;

			if (!displayName || !photoURL) {
				throw new Error('Missing information from Google Account.');
			}

			setUser({
				id: uid,
				name: displayName,
				avatar: photoURL,
			});
		}
	}

	return (
		<AuthContext.Provider value={{ user, signInWithGoogle }}>
			{props.children}
		</AuthContext.Provider>
	);
}
