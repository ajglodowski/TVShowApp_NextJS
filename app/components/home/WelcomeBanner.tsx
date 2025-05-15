import { Card, CardContent } from "@/components/ui/card";

export default async function WelcomeBanner() {

    return (
        <Card className="my-4 bg-black/50 rounded-md text-white border-none">
          <CardContent className="my-2 py-4">
            <h1 className="text-3xl font-semibold tracking-tight">Welcome to TV Show App</h1>
            <p className="text-white/70">Track, discover, and never miss your favorite shows</p>
          </CardContent>
        </Card>
    )
};