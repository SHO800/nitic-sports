'use client';

import { signIn } from '@/session'
import { useState } from 'react';

const SignIn = () => {
    const [username, setUsername] = useState('');

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
                onClick={() => {
                    signIn(username);
                }}
            >
                サインイン
            </button>
        </div>
    );
};

export default SignIn;