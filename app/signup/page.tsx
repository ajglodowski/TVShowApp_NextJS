import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { AtSign, ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { backdropBackground } from '../utils/stylingConstants'
import { signUp } from '../utils/supabase/AuthService'

export default async function Signup({
  searchParams,
}: {
  searchParams: Promise<{ message: string }>
}) {
    
  const signUpFunction = signUp;

  const Header = () => {
    return (
      <div className='text-white text-center mt-4 space-y-2'>
        <h1 className='text-xl font-bold'>Welcome to TV Show App</h1>
        <h2 className='text-md text-white/80'>If you&#39;re new here please enter your details below to create your account and get started</h2>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen bg-black my-8 flex items-center justify-center">
      <Card className={`justify-center ${backdropBackground} md:max-w-md my-auto px-4 border-none shadow-lg rounded-lg`}>
        <CardHeader className="flex justify-center">
            <Header />
        </CardHeader>
        <CardContent className="flex flex-col pt-4 border-t border-b border-white items-center justify-center">
          <form
            className="animate-in flex-1 flex flex-col w-full justify-center gap-2 text-foreground"
            action={signUpFunction}
          >
            <label className="text-md" htmlFor="username">
              Username
            </label>
            <div className="relative flex-1 w-full mb-4 md:mb-0 rounded-md px-4 py-2 bg-inherit border">
                <AtSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4" />
                <input
                className="ml-4 bg-inherit text-white"
                name="username"
                placeholder="yourusername"
                required
                />
                {/* <Input
                    className={`pl-10 bg-white/5 text-white`}
                    type="text"
                    name="search"
                    placeholder="Search through results" 
                    defaultValue={searchResults}
                /> */}
            </div>
            <label className="text-md" htmlFor="name">
              Name
            </label>
            <input
              className="rounded-md px-4 py-2 bg-inherit border"
              name="name"
              placeholder="Your name"
              required
            />
            <p className='text-xs text-white/80'>*Not Required</p>
            <label className="text-md" htmlFor="email">
              Email
            </label>
            <input
              className="rounded-md px-4 py-2 bg-inherit border mb-2"
              name="email"
              placeholder="you@example.com"
              required
            />
            <label className="text-md" htmlFor="password">
              Password
            </label>
            <input
              className="rounded-md px-4 py-2 bg-inherit border"
              type="password"
              name="password"
              placeholder="••••••••"
              required
            />
            <p className='text-sm text-white/80'>Password must be at least 8 characters long</p>
            <label className="text-md" htmlFor="confirmPassword">
              Confirm Password
            </label>
            <input
              className="rounded-md px-4 py-2 bg-inherit border mb-2"
              type="password"
              name="confirmPassword"
              placeholder="••••••••"
              required
            />
            <Button 
                variant={"outline"}
                className={`${backdropBackground} hover:bg-green-600 hover:text-white rounded-md px-4 py-2 my-2 text-foreground mb-2`}>
                Sign Up
            </Button>
            {(await searchParams)?.message && (
              <p className="mt-4 p-4 bg-foreground/10 text-foreground text-center">
                {(await searchParams).message}
              </p>
            )}
          </form>
        </CardContent>
        <CardFooter className="flex justify-center pt-4">
          <Link 
            href="/login"
            className="text-sm text-foreground/80 hover:text-foreground/100 transition-colors">
            <div className='flex items-center gap-2'>
              <p className="text-sm">Already have an account?</p>
              <p>Back to login</p>
              <ChevronRight className="h-4 w-4 text-foreground/70 hover:text-foreground/100 transition-colors" />
            </div>
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
