import { redirect } from "next/navigation";
import TransactionsPage from "@/modules/transactions/pages/transactions-page";
import { getTransactions } from "@/modules/transactions/api/queries";

interface TransactionsPageProps {
  searchParams: Promise<{
    accountId?: string;
    from?: string;
    to?: string;
    period?: string;
  }>;
}

export default async function Transactions({
  searchParams,
}: TransactionsPageProps) {
  const { accountId: rawAccountId, from, to, period } = await searchParams;

  const accountId = rawAccountId === "all" ? "" : rawAccountId || "";
  const selectedPeriod = period || "30days";

  // Calculate date range based on period if from/to are not provided
  let fromDate: Date;
  let toDate: Date;

  if (from && to) {
    fromDate = new Date(from);
    toDate = new Date(to);
  } else {
    // Default date range based on period
    toDate = new Date();
    fromDate = new Date();

    switch (selectedPeriod) {
      case "7days":
        fromDate.setDate(toDate.getDate() - 7);
        break;
      case "30days":
        fromDate.setDate(toDate.getDate() - 30);
        break;
      case "3months":
        fromDate.setMonth(toDate.getMonth() - 3);
        break;
      case "6months":
        fromDate.setMonth(toDate.getMonth() - 6);
        break;
      case "1year":
        fromDate.setFullYear(toDate.getFullYear() - 1);
        break;
      default:
        fromDate.setDate(toDate.getDate() - 30); // Default to 30 days
    }
  }

  const { data: transactions, success } = await getTransactions({
    accountId: accountId,
    from: fromDate,
    to: toDate,
  });

  if (!success) {
    redirect("/login");
  }

  return (
    <TransactionsPage
      transactions={transactions!}
      selectedAccountId={accountId}
      selectedPeriod={selectedPeriod}
      dateRange={{ from: fromDate, to: toDate }}
    />
  );
}
