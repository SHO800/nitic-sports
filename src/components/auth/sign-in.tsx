'use client';

import {isLoggedIn, signIn} from '@/session'
import { useState } from 'react';
import {useRouter} from "next/navigation";

const SignIn = () => {
    const [username, setUsername] = useState('');
    const router = useRouter();

    return (
        <div>
            <input
                type="text"
                value={username}
                placeholder="username"
                onChange={(event) => {
                    setUsername(event.target.value);
                }}
            />
            <button
                disabled={!username}
                onClick={async () => {
                    await signIn(username);
                    if (await isLoggedIn()) {
                        router.push('/match');
                    }
                }}
            >
                サインイン
            </button>
        </div>
    );
};

export default SignIn;