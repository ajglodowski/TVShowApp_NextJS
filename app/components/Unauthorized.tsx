import Link from 'next/link';

interface UnauthorizedProps {
  message?: string;
}

export default function Unauthorized({ message = "You don't have permission to access this page" }: UnauthorizedProps) {
  return (
    <div className='text-center my-auto mx-auto py-20'>
      <h1 className='text-4xl font-bold mb-4'>Unauthorized</h1>
      <h2 className='text-2xl mb-4'>{message}</h2>
      <h2 className='text-5xl mb-6'>🚫</h2>
      <Link href="/" className='text-lg underline hover:text-blue-400'>
        Return to Home
      </Link>
    </div>
  );
}

