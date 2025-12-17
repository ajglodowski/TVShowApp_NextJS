import { createClient } from '@/app/utils/supabase/server'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { ArrowRight, Tv2 } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { revalidateTag } from 'next/cache'
import { backdropBackground } from '@/app/utils/stylingConstants'

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
    revalidateTag('currentUser', 'minutes');
    return redirect('/')
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
            Keep track of<br />
            <span className="text-primary">everything you watch.</span>
          </h2>
          
          <p className="text-white/60 text-lg leading-relaxed">
            Rate shows, build your watchlist, and discover what to watch next based on your taste.
          </p>
          
          {/* Stats or features */}
          <div className="mt-10 grid grid-cols-3 gap-6">
            <div>
              <div className="text-2xl font-bold text-white">Track</div>
              <div className="text-sm text-white/50">Your progress</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">Rate</div>
              <div className="text-sm text-white/50">What you watch</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">Share</div>
              <div className="text-sm text-white/50">With friends</div>
            </div>
          </div>
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
                Track what you watch
              </p>
            </div>
          </div>

          {/* Login Card */}
          <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl text-white">Sign in</CardTitle>
              <CardDescription className="text-white/60">
                Enter your credentials to continue
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <form action={signIn} className="space-y-4">
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
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-white/80">Password</Label>
                    <Link 
                      href="/resetPassword"
                      className="text-xs text-white/50 hover:text-primary transition-colors"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    required
                    className="h-11 bg-white/5 border-white/10 text-white placeholder:text-white/40"
                  />
                </div>

                <Button type="submit" className="w-full h-11">
                  Sign in
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </form>

              {message && (
                <div className="mt-4 p-3 rounded-md bg-destructive/20 border border-destructive/30 text-destructive text-sm text-center">
                  {message}
                </div>
              )}
            </CardContent>

            <div className="px-6">
              <div className="relative">
                <Separator className="bg-white/10" />
                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-transparent px-2 text-xs text-white/40">
                  or
                </span>
              </div>
            </div>

            <CardFooter className="pt-4 pb-6">
              <Link href="/signup" className="w-full">
                <Button 
                  variant="outline" 
                  className="w-full h-11 border-white/20 bg-transparent hover:border-primary hover:bg-primary/5 transition-all duration-200"
                >
                  <span className="text-white/70">Don&apos;t have an account?</span>
                  <span className="ml-1 text-primary font-medium">Sign up</span>
                  <ArrowRight className="w-4 h-4 ml-1 text-primary" />
                </Button>
              </Link>
            </CardFooter>
          </Card>

          {/* Footer */}
          <p className="text-center text-xs text-white/30 mt-6">
            By continuing, you agree to our Terms and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  )
}
