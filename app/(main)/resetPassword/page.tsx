import { createClient } from '@/app/utils/supabase/server'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { ArrowLeft, Tv2, Mail } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { backdropBackground } from '@/app/utils/stylingConstants'

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

  const message = (await searchParams)?.message

  return (
    <div className="fixed inset-0 w-full flex bg-[radial-gradient(circle_at_0%_0%,rgb(120,60,20)_0%,rgb(60,25,5)_50%,rgb(5,5,5)_100%)]">
      {/* Left side - decorative */}
      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center">
        {/* Diagonal lines pattern */}
        <div className="absolute inset-0 opacity-[0.04]">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute h-px bg-white origin-left"
              style={{
                width: '200%',
                top: `${i * 8}%`,
                left: '-50%',
                transform: 'rotate(-12deg)',
              }}
            />
          ))}
        </div>
        
        {/* Center content */}
        <div className="relative z-10 max-w-md px-12">
          <div className="flex items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary text-primary-foreground">
              <Tv2 className="w-6 h-6" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-white">TV Show App</span>
          </div>
          
          <h2 className="text-4xl font-bold tracking-tight text-white mb-4 leading-tight">
            Forgot your<br />
            <span className="text-primary">password?</span>
          </h2>
          
          <p className="text-white/60 text-lg leading-relaxed">
            No worries! Enter your email and we&apos;ll send you instructions to reset your password.
          </p>
        </div>
        
        {/* Corner accent */}
        <div className="absolute bottom-0 right-0 w-64 h-64 border-l border-t border-white/10 rounded-tl-[100px]" />
      </div>

      {/* Right side - form */}
      <div className={`flex-1 flex items-center justify-center p-6 lg:p-12 ${backdropBackground}`}>
        <div className="w-full max-w-sm animate-in">
          {/* Mobile header - only shows on smaller screens */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary text-primary-foreground">
              <Tv2 className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-white tracking-tight">
                TV Show App
              </h1>
              <p className="text-xs text-white/60">
                Reset your password
              </p>
            </div>
          </div>

          {/* Reset Password Card */}
          <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl text-white">Reset password</CardTitle>
              <CardDescription className="text-white/60">
                Enter your email to receive reset instructions
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <form action={resetPassword} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white/80">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    required
                    className="h-11 bg-white/5 border-white/10 text-white placeholder:text-white/40"
                  />
                </div>

                <Button type="submit" className="w-full h-11">
                  Send reset link
                  <Mail className="w-4 h-4" />
                </Button>
              </form>

              {message && (
                <div className="mt-4 p-3 rounded-md bg-destructive/20 border border-destructive/30 text-destructive text-sm text-center">
                  {message}
                </div>
              )}
            </CardContent>

            <div className="px-6">
              <Separator className="bg-white/10" />
            </div>

            <CardFooter className="pt-4 pb-6">
              <Link href="/login" className="w-full">
                <Button 
                  variant="outline" 
                  className="w-full h-11 border-white/20 bg-transparent hover:border-primary hover:bg-primary/5 transition-all duration-200"
                >
                  <ArrowLeft className="w-4 h-4 mr-1 text-primary" />
                  <span className="text-white/70">Back to</span>
                  <span className="ml-1 text-primary font-medium">Sign in</span>
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
