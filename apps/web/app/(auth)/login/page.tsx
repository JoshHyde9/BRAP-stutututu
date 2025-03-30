"use client";

import { signIn } from "@workspace/auth";
import { Button } from "@workspace/ui/components/button";

export default function SignIn() {
  return (
    <Button
      onClick={async () =>
        await signIn.social({
          provider: "discord",
          callbackURL: "http://server:5000",
        })
      }
    >
      Sign in
    </Button>
  );
}
