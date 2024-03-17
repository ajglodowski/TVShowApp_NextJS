
import React from 'react';
import Link from 'next/link';
import AuthButton from '@/supabase_components/AuthButton';

function Navbar() {
    return (
        <nav>
            <ul className='flex justify-between'>
                <li key="home">
                    <Link href="/">Home</Link>
                </li>
                <li key="watchlist">
                    <Link href="/watchlist">Watchlist</Link>
                </li>
                <li key="auth">
                    <AuthButton />
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;
