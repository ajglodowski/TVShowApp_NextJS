export default async function WelcomeBanner() {
    return (
        <div className="pt-6 pb-4">
            <div className="space-y-1.5">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
                    Welcome back
                </h1>
                <p className="text-sm sm:text-base text-white/50 font-medium">
                    Track, discover, and never miss your favorite shows
                </p>
            </div>
        </div>
    )
};