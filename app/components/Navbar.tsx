
import React from 'react';
import Link from 'next/link';
import AuthButton from '@/supabase_components/AuthButton';

function Navbar() {

    const textButtonStyle = ' my-auto text-white p-1 outline rounded-md m-1 hover:text-black hover:bg-white hover:shadow-md transition duration-300 ease-in-out';

    return (
        <nav>
            <ul className='flex justify-between my-auto'>
                <li key="home" className={`${textButtonStyle}`}>
                    <Link href="/">Home</Link>
                </li>
                <li key="watchlist" className={`${textButtonStyle}`}>
                    <div className=''>
                        <Link href="/watchlist">Watchlist</Link>
                    </div>
                </li>
                <li key="auth">
                    <AuthButton />
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;
