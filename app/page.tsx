import Link from "next/link";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="p-8">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">Welcome to the Gacha Build Planner!</h1>
        <p className="text-xl text-center mb-12">Choose your game to start planning your builds.</p>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Genshin Impact</CardTitle>
              <CardDescription>Plan your character builds for Teyvat</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center">
              <img src="/genshin/logo.png" alt="Genshin Impact" className="max-w-full h-48 max-h-full object-contain" />
            </CardContent>
            <CardFooter>
              <Link href="/genshin" className="w-full">
                <Button className="w-full">Go to Genshin Impact Planner</Button>
              </Link>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Honkai: Star Rail</CardTitle>
              <CardDescription>Optimize your team for the cosmic journey</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center">
              <img
                src="/starrail/logo.png"
                alt="Honkai: Star Rail"
                className="max-w-full h-48 max-h-full object-contain"
              />
            </CardContent>
            <CardFooter>
              <Link href="/starrail" className="w-full">
                <Button className="w-full">Go to Star Rail Planner</Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </main>
  );
}
