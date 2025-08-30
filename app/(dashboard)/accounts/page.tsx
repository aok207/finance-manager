import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { balanceAccount } from "@/db/schemas/account-schema";
import { eq, ilike, desc, and } from "drizzle-orm";
import AccountsPage from "@/modules/accounts/pages/accounts-page";

interface AccountsPageProps {
  searchParams: Promise<{
    query?: string;
    page?: string;
    pageSize?: string;
  }>;
}

export default async function Accounts({ searchParams }: AccountsPageProps) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in");
  }

  const query = (await searchParams).query || "";
  const page = parseInt((await searchParams).page || "1");
  const pageSize = parseInt((await searchParams).pageSize || "10");
  const offset = (page - 1) * pageSize;

  const whereConditions = [eq(balanceAccount.userId, session.user.id)];

  if (query) {
    whereConditions.push(ilike(balanceAccount.name, `%${query}%`));
  }

  const accounts = await db
    .select()
    .from(balanceAccount)
    .where(and(...whereConditions))
    .orderBy(desc(balanceAccount.createdAt))
    .limit(pageSize)
    .offset(offset);

  const totalCount = await db
    .select({ count: balanceAccount.id })
    .from(balanceAccount)
    .where(eq(balanceAccount.userId, session.user.id))
    .then((result) => result.length);

  return (
    <AccountsPage
      accounts={accounts}
      totalCount={totalCount}
      currentPage={page}
      pageSize={pageSize}
      searchQuery={query}
    />
  );
}
