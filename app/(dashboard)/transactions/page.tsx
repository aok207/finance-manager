import { redirect } from "next/navigation";
import TransactionsPage from "@/modules/transactions/pages/transactions-page";
import { getTransactions } from "@/modules/transactions/api/queries";

interface TransactionsPageProps {
  searchParams: Promise<{
    accountId?: string;
    from?: string;
    to?: string;
  }>;
}

export default async function Transactions({
  searchParams,
}: TransactionsPageProps) {
  let { accountId, from, to } = await searchParams;

  accountId = accountId === "all" ? "" : accountId;

  const { data: transactions, success } = await getTransactions({
    accountId: accountId,
    from: from ? new Date(from) : undefined,
    to: to ? new Date(to) : undefined,
  });

  if (!success) {
    redirect("/login");
  }

  return <TransactionsPage transactions={transactions!} />;
}
