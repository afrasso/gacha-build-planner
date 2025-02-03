import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <main className="p-8">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">Welcome to the Gacha Build Planner!</h1>
        <p className="text-xl text-center mb-12">Choose your game to start planning your builds.</p>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Genshin Impact</CardTitle>
              <CardDescription>Plan your character builds for Teyvat</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center">
              <div className="relative w-full aspect-[16/9]">
                <Image
                  alt="Genshin Impact"
                  className="object-contain"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  src="/genshin/logo.png"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Link className="w-full" href="/genshin">
                <Button className="w-full">Go to Genshin Impact Planner</Button>
              </Link>
            </CardFooter>
          </Card>

          <Card className="w-full">
            <CardHeader>
              <CardTitle>Honkai: Star Rail</CardTitle>
              <CardDescription>Optimize your team for the cosmic journey</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center">
              <div className="relative w-full aspect-[16/9]">
                <Image
                  alt="Honkai: Star Rail"
                  className="object-contain"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  src="/starrail/logo.png"
                />
              </div>
            </CardContent>
            <CardFooter>
              <Link className="w-full" href="/starrail">
                <Button className="w-full">Go to Star Rail Planner</Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </div>
    </main>
  );
}
