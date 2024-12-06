"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaDiscord, FaFacebook } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthContext } from "@/contexts/AuthContext";

import { initiateDiscordOauthSignIn, initiateFacebookOauthSignIn, initiateGoogleOauthSignIn } from "../actions/auth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoginError, setIsLoginError] = useState(false);
  const { login } = useAuthContext();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login({ email, password });
    if (success) {
      router.push("/");
    } else {
      setIsLoginError(true);
    }
  };

  const updateEmail = (email: string) => {
    setIsLoginError(false);
    setEmail(email);
  };

  const updatePassword = (email: string) => {
    setIsLoginError(false);
    setPassword(email);
  };

  const signInWithDiscord = async () => {
    const success = await initiateDiscordOauthSignIn();
    if (success) {
      router.push("/");
    }
  };

  const signInWithFacebook = async () => {
    const success = await initiateFacebookOauthSignIn();
    if (success) {
      router.push("/");
    }
  };

  const signInWithGoogle = async () => {
    const success = await initiateGoogleOauthSignIn();
    if (success) {
      router.push("/");
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
              <Label htmlFor="email">Email</Label>
              <Input id="email" onChange={(e) => updateEmail(e.target.value)} required type="text" value={email} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                onChange={(e) => updatePassword(e.target.value)}
                required
                type="password"
                value={password}
              />
            </div>
            {isLoginError && <p className="text-red-500 text-sm">Invalid login credentials. Please try again.</p>}
            <Button className="w-full" type="submit">
              Sign in with Credentials
            </Button>
          </form>
        </CardContent>
        <CardFooter className="gap-2 justify-center">
          <Button
            className="hover:bg-transparent focus:bg-transparent"
            onClick={signInWithDiscord}
            size="icon"
            variant="ghost"
          >
            <FaDiscord className="w-8 h-8 text-[#7289da]" />
          </Button>
          <Button
            className="hover:bg-transparent focus:bg-transparent"
            onClick={signInWithFacebook}
            size="icon"
            variant="ghost"
          >
            <FaFacebook className="w-8 h-8 text-[#1877f2]" />
          </Button>
          <Button
            className="hover:bg-transparent focus:bg-transparent"
            onClick={signInWithGoogle}
            size="icon"
            variant="ghost"
          >
            <FcGoogle className="w-8 h-8" />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
