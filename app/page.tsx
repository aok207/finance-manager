import { auth } from "@/lib/auth";
import SignOutButton from "@/modules/auth/ui/components/sign-out-button";
import { headers } from "next/headers";
import Link from "next/link";

export default async function Home() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return (
      <main>
        You're not signed in.
        <Link href={"/sign-in"}>Sign in</Link>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      Welcome
      <SignOutButton />
    </main>
  );
}
