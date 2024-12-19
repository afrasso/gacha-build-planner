"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";

interface AuthCallbackClientProps {
  callbackUrl: string;
}

export default function AuthCallbackClient({ callbackUrl }: AuthCallbackClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(true);

  // This is needed to prevent authorization with the same code being attempted more than once due to React's strict
  // mode in development attempting to mount the component more than once.
  const hasFetchedRef = useRef(false);

  const code = searchParams.get("code");

  useEffect(() => {
    const handleAuthorizationCode = async (code: string) => {
      try {
        const response = await fetch(callbackUrl, {
          body: JSON.stringify({ code }),
          headers: { "Content-Type": "application/json" },
          method: "POST",
        });

        if (!response.ok) {
          throw new Error("Failed to exchange code for token.");
        }

        const data = await response.json();
        localStorage.setItem("token", data.access_token);
        router.push("/");
      } catch (err) {
        console.error("Error exchanging code for token:", err);
        setError("Failed to authenticate. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    if (code && isLoading && !hasFetchedRef.current) {
      hasFetchedRef.current = true;
      handleAuthorizationCode(code);
    } else if (!code && isLoading) {
      setError("No authorization code was found in the URL.");
      setIsLoading(false);
    }
  }, [callbackUrl, code, isLoading, router]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background">
        <div className="text-center text-red-500 mb-4">{error}</div>
        <Button onClick={() => router.push("/login")}>Return to Login</Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">Authenticating...</div>
      </div>
    );
  }

  return null;
}
