import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { balanceAccount } from "@/db/schemas/account-schema";
import { eq, ilike, desc, and } from "drizzle-orm";
import AccountsPage from "@/modules/accounts/pages/accounts-page";
import { getAccounts } from "@/modules/accounts/api/queries";

interface AccountsPageProps {
  searchParams: Promise<{
    query?: string;
    page?: string;
    pageSize?: string;
  }>;
}

export default async function Accounts({ searchParams }: AccountsPageProps) {
  const { data: accounts, success } = await getAccounts();

  if (!success) {
    redirect("/login");
  }

  return <AccountsPage accounts={accounts!} />;
}
