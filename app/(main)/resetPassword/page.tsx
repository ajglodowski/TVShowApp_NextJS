import { createClient } from '@/app/utils/supabase/server'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { backdropBackground } from '@/app/utils/stylingConstants'
import { ChevronRight } from 'lucide-react'

export default async function ResetPassword({
  searchParams,
}: {
  searchParams: Promise<{ message: string }>
}) {
  const resetPassword = async (formData: FormData) => {
    'use server'
    
    const email = formData.get('email') as string
    
    if (!email) {
      return redirect('/resetPassword?message=Please enter your email')
    }
    
    const supabase = await createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?next=/updatePassword`,
    })

    if (error) {
      return redirect(`/resetPassword?message=${encodeURIComponent(error.message)}`)
    }
    
    return redirect('/updatePassword')
  }

  return (
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-lg justify-center gap-2 bg-black">
      <Card className={`justify-center ${backdropBackground} md:max-w-lg px-4 my-8 border-none shadow-lg rounded-lg`}>
        <CardHeader className="flex">
          <div className='text-white space-y-2'>
            <h1 className='text-xl font-bold'>Reset Your Password</h1>
            <h2 className='text-md text-white/80'>Enter your email to receive password reset instructions</h2>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col pt-4 border-t border-b border-white items-center justify-center">
          <form
            className="animate-in flex-1 flex flex-col w-full justify-center gap-2 text-foreground"
            action={resetPassword}
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
            <Button 
              variant={"outline"}
              className={`${backdropBackground} hover:bg-green-600 hover:text-white rounded-md px-4 py-2 text-foreground mb-2`}>
              Send Reset Link
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center pt-4">
          <Link 
            href="/login"
            className="text-sm text-foreground/80 hover:text-foreground/100 transition-colors">
            <div className='flex items-center gap-2'>
              <p className="text-sm">Remember your password?</p>
              <p>Back to login</p>
              <ChevronRight className="h-4 w-4 text-foreground/70 hover:text-foreground/100 transition-colors" />
            </div>
          </Link>
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