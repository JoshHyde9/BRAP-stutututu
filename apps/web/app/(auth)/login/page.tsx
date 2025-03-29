"use client";

import { signIn } from "@workspace/auth";
import { Button } from "@workspace/ui/components/button";

export default function SignIn() {
  return (
    <Button
      onClick={async () =>
        await signIn.social({
          provider: "discord",
          callbackURL: process.env.NEXT_PUBLIC_CORS_URL || "http://localhost:3000",
        })
      }
    >
      Sign in
    </Button>
  );
}
