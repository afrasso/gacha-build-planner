"use client";

import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

export default function AuthButton() {
  const { data: session } = useSession();
  const router = useRouter();

  if (session) {
    return (
      <div className="flex items-center gap-4">
        <span>Signed in as {session.user?.email}</span>
        <Button onClick={() => signOut()}>Sign out</Button>
      </div>
    );
  }

  return <Button onClick={() => router.push("/login")}>Sign in</Button>;
}
