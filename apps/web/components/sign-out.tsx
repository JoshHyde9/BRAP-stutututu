"use client";

import { signOut, useSession } from "@workspace/auth";
import { Button } from "@workspace/ui/components/button";

export const SignOut = () => {
  const { data: session } = useSession();
  return (
    <div>
      {session && (
        <Button onClick={async () => await signOut()}>Sign out</Button>
      )}
    </div>
  );
};
