import { ArrowUpDown, Flower, Wrench } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Genshin Impact Build Planner</h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Manage Builds</CardTitle>
            <CardDescription>Create and edit character builds</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <Wrench className="w-12 h-12 mx-auto mb-4" />
            <p>Optimize your team compositions and individual character builds.</p>
          </CardContent>
          <CardFooter>
            <Link className="w-full" href="/genshin/builds">
              <Button className="w-full">Go to Builds</Button>
            </Link>
          </CardFooter>
        </Card>

        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Artifact Inventory</CardTitle>
            <CardDescription>View and curate your artifacts</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <Flower className="w-12 h-12 mx-auto mb-4" />
            <p>Manage your artifact collection and find the best pieces for your characters.</p>
          </CardContent>
          <CardFooter>
            <Link className="w-full" href="/genshin/artifacts">
              <Button className="w-full">View Artifacts</Button>
            </Link>
          </CardFooter>
        </Card>

        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Import/Export Data</CardTitle>
            <CardDescription>Backup or restore your planner data</CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <ArrowUpDown className="w-12 h-12 mx-auto mb-4" />
            <p>Save your progress or import data from external sources.</p>
          </CardContent>
          <CardFooter>
            <Link className="w-full" href="/genshin/importexport">
              <Button className="w-full">Manage Data</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
