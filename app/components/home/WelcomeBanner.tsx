export default async function WelcomeBanner() {

    return (
        <section className="my-4">
          <div className="flex flex-col gap-6">
            <div className="space-y-2">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Welcome to TV Show App</h1>
              <p className="text-white/70">Track, discover, and never miss your favorite shows</p>
            </div>
          </div>
        </section>
    )
};