import { createClient } from '@/app/utils/supabase/server'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { backdropBackground } from '../utils/stylingConstants'

export default async function Login({
  searchParams,
}: {
  searchParams: Promise<{ message: string }>
}) {
  const signIn = async (formData: FormData) => {
    'use server'
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return redirect('/login?message=Could not authenticate user')
    }
    return redirect('/')
  }

  return (
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-lg justify-center gap-2 bg-black">
      <Card className={`justify-center ${backdropBackground} md:max-w-lg px-4 my-8 border-none shadow-lg rounded-lg`}>
        <CardHeader className="flex">
          <div className='text-white space-y-2'>
            <h1 className='text-xl font-bold'>Welcome back to TV Show App</h1>
            <h2 className='text-md text-white/80'>Please enter your details below to sign in</h2>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col pt-4 border-t border-b border-white items-center justify-center">
          <form
            className="animate-in flex-1 flex flex-col w-full justify-center gap-2 text-foreground"
            action={signIn}
          >
            <label className="text-md" htmlFor="email">
              Email
            </label>
            <input
              className="rounded-md px-4 py-2 bg-inherit border mb-6"
              name="email"
              placeholder="you@example.com"
              required
            />
            <label className="text-md" htmlFor="password">
              Password
            </label>
            <input
              className="rounded-md px-4 py-2 bg-inherit border mb-6"
              type="password"
              name="password"
              placeholder="••••••••"
              required
            />
            <button className="bg-green-700 rounded-md px-4 py-2 text-foreground mb-2">
              Sign In
            </button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center pt-4">
          <div className='flex flex-col gap-2'>
            <Link 
              href="/resetPassword"
              className="text-sm text-foreground/80 hover:text-foreground/100 transition-colors">
              <div className='flex items-center gap-2'>
                <p className="text-sm">Forgot your password?</p>
                <p>Reset it</p>
                <ChevronRight className="h-4 w-4 text-foreground/70 hover:text-foreground/100 transition-colors" />
              </div>
          </Link>
          <Link 
            href="/signup"
            className="text-sm text-foreground/80 hover:text-foreground/100 transition-colors">
            <div className='flex items-center gap-2'>
              <p className="text-sm">Don't have an account?</p>
              <p>Create an account</p>
              <ChevronRight className="h-4 w-4 text-foreground/70 hover:text-foreground/100 transition-colors" />
              </div>
            </Link>
          </div>
        </CardFooter>
      </Card>
      {(await searchParams)?.message && (
            <p className="mt-4 p-4 bg-foreground/10 text-foreground text-center">
              {(await searchParams).message}
            </p>
          )}
    </div>
  )
}
