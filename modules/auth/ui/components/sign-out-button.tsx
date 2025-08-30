"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";

const SignOutButton = () => {
  const router = useRouter();

  return (
    <Button
      onClick={async () => {
        await authClient.signOut({
          fetchOptions: {
            onSuccess: () => {
              toast.success("Logged out successfully");
              router.replace("/sign-in");
            },
          },
        });
      }}
    >
      Sign Out
    </Button>
  );
};

export default SignOutButton;
