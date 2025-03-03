"use client";

import { signOut } from "@workspace/auth";
import { Button } from "@workspace/ui/components/button";
import { redirect } from "next/navigation";

export const SignOut = () => {
  return (
    <Button
    size="lg"
      onClick={async () =>
        await signOut({
          fetchOptions: {
            onSuccess: () => {
              redirect("/");
            },
          },
        })
      }
    >
      Sign out
    </Button>
  );
};
