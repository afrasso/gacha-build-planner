"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

import { useAuthContext } from "../contexts/AuthContext";

export default function AuthButton() {
  const { logout, user } = useAuthContext();
  const router = useRouter();

  if (user) {
    return (
      <div className="flex items-center gap-4">
        <span>Signed in as {user.email}</span>
        <Button
          onClick={async () => {
            await logout();
            router.push("/");
          }}
        >
          Sign out
        </Button>
      </div>
    );
  }

  return <Button onClick={() => router.push("/login")}>Sign in</Button>;
}
