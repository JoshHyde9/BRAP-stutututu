"use client";

import { signIn } from "@workspace/auth";
import { Button } from "@workspace/ui/components/button";

export default function SignIn() {
  return (
    <Button
      onClick={async () =>
        await signIn.social({
          provider: "discord",
          callbackURL: "https://ripcord.jimslab.cc",
        })
      }
    >
      Sign in
    </Button>
  );
}
