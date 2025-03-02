"use client";

import { signIn, useSession } from "@workspace/auth";
import { Button } from "@workspace/ui/components/button";

export const SignIn = () => {
  const { data: session } = useSession();
  return (
    <div>
      {session ? (
        <code>{JSON.stringify(session.user, null, 2)}</code>
      ) : (
        <Button
          onClick={async () =>
            await signIn.social({
              provider: "discord",
              callbackURL: "http://localhost:3000",
            })
          }
        >Sign in</Button>
      )}
    </div>
  );
};
