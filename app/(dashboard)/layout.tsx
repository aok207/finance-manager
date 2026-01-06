import { auth } from "@/lib/auth";
import DashboardHeader from "@/modules/dashboard/ui/components/dashboard-header";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import React, { ReactNode } from "react";

const Layout = async ({ children }: { children: ReactNode }) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-slate-950 dark:via-slate-900/95 dark:to-slate-900/90">
      <DashboardHeader user={session!.user} />

      <main className="container mx-auto px-6 py-8 max-w-7xl">{children}</main>
    </div>
  );
};

export default Layout;
