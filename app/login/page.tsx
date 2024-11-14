"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await signIn("credentials", {
      password,
      redirect: false,
      username,
    });
    if (result?.error) {
      console.error(result.error);
      // Handle error (e.g., show error message to user)
    } else {
      // Redirect to dashboard or home page on successful login
      window.location.href = "/";
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Sign In</CardTitle>
          <CardDescription>Enter your credentials or use a provider to sign in.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                onChange={(e) => setUsername(e.target.value)}
                required
                type="text"
                value={username}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                onChange={(e) => setPassword(e.target.value)}
                required
                type="password"
                value={password}
              />
            </div>
            <Button className="w-full" type="submit">
              Sign in with Credentials
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={() => signIn("google")}>
            Sign in with Google
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
