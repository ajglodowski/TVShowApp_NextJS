
import React from 'react';
import Link from 'next/link';
import AuthButton from '@/supabase_components/AuthButton';

function Navbar() {
    return (
        <nav>
            <ul className='flex justify-between'>
                <li>
                    <Link href="/">Home</Link>
                </li>
                <li>
                    <Link href="/show/1">About</Link>
                </li>
                <li>
                    <AuthButton />
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;
