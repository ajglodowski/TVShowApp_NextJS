import { Button } from '@/components/ui/button';
import { ArrowRight, Bell, Heart, History, Search, Tv2, Users } from 'lucide-react';
import Link from 'next/link';

const features = [
  {
    icon: History,
    title: 'Track Your Progress',
    description: 'Keep tabs on every show you watch. Never forget where you left off or what to watch next.',
  },
  {
    icon: Heart,
    title: 'Rate & Review',
    description: 'Express your opinions. Love it? Hate it? Share your takes and see what others think.',
  },
  {
    icon: Users,
    title: 'Follow Friends',
    description: "See what your friends are watching, catch their updates, and get inspired by their picks.",
  },
  {
    icon: Search,
    title: 'Discover New Shows',
    description: 'Find your next binge through recommendations from people with similar taste.',
  },
];

const stats = [
  { value: '1000+', label: 'Shows' },
  { value: 'Social', label: 'Network' },
  { value: '∞', label: 'Possibilities' },
];

export default function LandingPage() {
  return (
    <div className="min-h-[calc(100vh-56px)] w-full overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center px-4 sm:px-6">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Floating orbs with animation */}
          <div 
            className="absolute w-[500px] h-[500px] rounded-full bg-primary/20 blur-[120px] animate-float animate-glow-pulse"
            style={{ top: '10%', left: '-10%' }}
          />
          <div 
            className="absolute w-[400px] h-[400px] rounded-full bg-orange-500/15 blur-[100px] animate-float-delayed animate-glow-pulse"
            style={{ bottom: '5%', right: '-5%' }}
          />
          <div 
            className="absolute w-[300px] h-[300px] rounded-full bg-amber-500/10 blur-[80px] animate-float"
            style={{ top: '50%', left: '60%', animationDelay: '-2s' }}
          />
          
          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-[0.03]">
            <div 
              className="w-full h-full"
              style={{
                backgroundImage: `
                  linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
                `,
                backgroundSize: '60px 60px',
              }}
            />
          </div>
          
          {/* Diagonal accent lines */}
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent animate-fade-in"
              style={{
                width: '150%',
                top: `${15 + i * 15}%`,
                left: '-25%',
                transform: `rotate(-8deg)`,
                animationDelay: `${i * 100}ms`,
              }}
            />
          ))}
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          {/* Logo badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 animate-slide-up hover:bg-white/10 hover:border-white/20 transition-all duration-300 cursor-default">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary text-primary-foreground">
              <Tv2 className="w-4 h-4" />
            </div>
            <span className="text-sm font-medium text-white/80">TV Show App</span>
          </div>

          {/* Main headline */}
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight text-white mb-6 animate-slide-up [animation-delay:100ms]">
            Your shows.{' '}
            <span className="relative inline-block">
              <span className="text-shimmer">
                Your story.
              </span>
              <span className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-primary/60 via-orange-400/60 to-transparent rounded-full" />
            </span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg sm:text-xl text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed animate-slide-up [animation-delay:200ms]">
            Track what you watch, see what your friends are into, 
            and discover your next favorite show together.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-slide-up [animation-delay:300ms]">
            <Link href="/signup">
              <Button size="lg" className="h-12 px-8 text-base font-semibold group hover:scale-105 transition-transform duration-200">
                Get Started Free
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link href="/login">
              <Button 
                variant="outline" 
                size="lg" 
                className="h-12 px-8 text-base border-white/20 bg-white/5 hover:bg-white/10 hover:scale-105 text-white transition-all duration-200"
              >
                Sign In
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-center gap-8 sm:gap-16 animate-slide-up [animation-delay:400ms]">
            {stats.map((stat, i) => (
              <div key={i} className="text-center group cursor-default">
                <div className="text-2xl sm:text-3xl font-bold text-primary transition-transform duration-300 group-hover:scale-110">{stat.value}</div>
                <div className="text-xs sm:text-sm text-white/50 uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-fade-in [animation-delay:500ms]">
          <div className="flex flex-col items-center gap-2 text-white/30 animate-bounce-subtle">
            <span className="text-xs uppercase tracking-widest">Scroll</span>
            <div className="w-px h-8 bg-gradient-to-b from-white/30 to-transparent" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-24 px-4 sm:px-6">
        {/* Section background accent */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/30 to-transparent pointer-events-none" />
        
        <div className="relative z-10 max-w-6xl mx-auto">
          {/* Section header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Everything you need to{' '}
              <span className="text-primary">enjoy TV</span>
            </h2>
            <p className="text-white/50 max-w-xl mx-auto">
              A complete platform designed for the modern TV enthusiast.
            </p>
          </div>

          {/* Features grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <div
                key={i}
                className="feature-card group relative p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-primary/50 hover:bg-white/[0.06] animate-scale-in"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                {/* Icon */}
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-4 group-hover:bg-primary/20 transition-all duration-300 group-hover:scale-110">
                  <feature.icon className="w-6 h-6 transition-transform duration-300 group-hover:rotate-6" />
                </div>
                
                {/* Content */}
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-white/50 leading-relaxed">{feature.description}</p>
                
                {/* Hover accent */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof / How it works */}
      <section className="relative py-24 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="relative p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-white/[0.08] to-white/[0.02] border border-white/10 overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[100px] rounded-full pointer-events-none animate-glow-pulse" />
            
            <div className="relative z-10 flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
              {/* Left content */}
              <div className="flex-1 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-medium mb-4">
                  <Bell className="w-3 h-3" />
                  Stay Connected
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                  See what everyone&apos;s watching
                </h3>
                <p className="text-white/50 mb-6 leading-relaxed">
                  Follow friends and see their updates in real-time. Get notified when they 
                  start a new show, finish a season, or rate something you might love.
                </p>
                <Link href="/signup">
                  <Button className="group hover:scale-105 transition-transform duration-200">
                    Join the Community
                    <Users className="w-4 h-4 transition-transform group-hover:scale-110" />
                  </Button>
                </Link>
              </div>

              {/* Right visual - animated */}
              <div className="flex-shrink-0">
                <div className="relative w-48 h-48 sm:w-56 sm:h-56">
                  {/* Pulsing ring effect */}
                  <div className="absolute inset-0 rounded-full border-2 border-primary/30 animate-ring-pulse" />
                  
                  {/* Concentric circles */}
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute inset-0 rounded-full border border-primary/20"
                      style={{
                        transform: `scale(${1 - i * 0.25})`,
                        opacity: 1 - i * 0.3,
                      }}
                    />
                  ))}
                  
                  {/* Center icon */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-20 h-20 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/30 hover:scale-110 transition-transform duration-300 cursor-default">
                      <Users className="w-10 h-10 text-primary-foreground" />
                    </div>
                  </div>
                  
                  {/* Orbiting dots container */}
                  <div className="absolute inset-0 animate-orbit">
                    {[...Array(6)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute w-2.5 h-2.5 rounded-full bg-primary/70 shadow-sm shadow-primary/50"
                        style={{
                          top: `${50 + 45 * Math.sin((i * Math.PI * 2) / 6)}%`,
                          left: `${50 + 45 * Math.cos((i * Math.PI * 2) / 6)}%`,
                          transform: 'translate(-50%, -50%)',
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative py-24 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to join the conversation?
          </h2>
          <p className="text-white/50 mb-8">
            Connect with friends, track your shows, and never miss what&apos;s trending.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/signup">
              <Button size="lg" className="h-12 px-8 text-base font-semibold group hover:scale-105 transition-transform duration-200">
                Create Free Account
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-8 px-4 sm:px-6 border-t border-white/10">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 group cursor-default">
            <div className="w-6 h-6 rounded bg-primary flex items-center justify-center transition-transform duration-300 group-hover:rotate-12">
              <Tv2 className="w-3 h-3 text-primary-foreground" />
            </div>
            <span className="text-sm font-medium text-white/60">TV Show App</span>
          </div>
          <p className="text-xs text-white/30">
            Built with care by @ajglodo
          </p>
        </div>
      </footer>
    </div>
  );
}
