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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <DashboardHeader user={session!.user} />

      <main className="container mx-auto px-6 py-8">{children}</main>
    </div>
  );
};

export default Layout;
