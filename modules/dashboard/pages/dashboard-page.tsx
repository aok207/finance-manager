import FilterDropdowns from "../ui/components/filter-dropdowns";
import FinancialOverview, {
  FinancialMetric,
} from "../ui/sections/financial-overview";
import TransactionsSection from "../ui/sections/transactions-section";
import CategoriesSection from "../ui/sections/categories-section";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getTransactions } from "@/modules/transactions/api/queries";
import { getAccounts } from "@/modules/accounts/api/queries";
import { getCategories } from "@/modules/categories/api/queries";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Parse search params for filters
  const accountId = (searchParams?.accountId as string) || "";
  const period = (searchParams?.period as string) || "30days";
  const fromParam = searchParams?.from as string;
  const toParam = searchParams?.to as string;

  // Calculate date range based on period or custom dates
  let to = new Date();
  let from = new Date();

  // If custom dates are provided, use them; otherwise use period
  if (fromParam && toParam) {
    from = new Date(fromParam);
    to = new Date(toParam);
  } else {
    switch (period) {
      case "7days":
        from.setDate(to.getDate() - 7);
        break;
      case "30days":
        from.setDate(to.getDate() - 30);
        break;
      case "3months":
        from.setMonth(to.getMonth() - 3);
        break;
      case "6months":
        from.setMonth(to.getMonth() - 6);
        break;
      case "1year":
        from.setFullYear(to.getFullYear() - 1);
        break;
      default:
        from.setDate(to.getDate() - 30); // Default to 30 days
    }
  }

  // Fetch current period data
  const [
    { data: transactions = [] },
    { data: accounts = [] },
    { data: categories = [] },
  ] = await Promise.all([
    getTransactions({ accountId, from, to }),
    getAccounts(),
    getCategories(),
  ]);

  // Fetch previous period data for comparison (30 days before current period)
  const previousFrom = new Date(from);
  previousFrom.setDate(from.getDate() - 30);
  const previousTo = new Date(to);
  previousTo.setDate(to.getDate() - 30);

  const { data: previousTransactions = [] } = await getTransactions({
    accountId,
    from: previousFrom,
    to: previousTo,
  });

  // Calculate current period metrics
  const income = transactions
    .filter((t) => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);
  const expenses = transactions
    .filter((t) => t.amount < 0)
    .reduce((sum, t) => sum + t.amount, 0);
  const remaining = income + expenses;

  // Calculate previous period metrics
  const previousIncome = previousTransactions
    .filter((t) => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);
  const previousExpenses = previousTransactions
    .filter((t) => t.amount < 0)
    .reduce((sum, t) => sum + t.amount, 0);
  const previousRemaining = previousIncome + previousExpenses;

  // Helper function to calculate percentage change
  const calculateChange = (
    current: number,
    previous: number
  ): { change: string; changeType: "positive" | "negative" } => {
    if (previous === 0) {
      if (current === 0) {
        return { change: "No change", changeType: "positive" };
      }
      return {
        change: current > 0 ? "+100%" : "-100%",
        changeType: current > 0 ? "positive" : "negative",
      };
    }

    const percentChange = ((current - previous) / Math.abs(previous)) * 100;
    const sign = percentChange >= 0 ? "+" : "";

    return {
      change: `${sign}${percentChange.toFixed(1)}% from last period`,
      changeType: percentChange >= 0 ? "positive" : "negative",
    };
  };

  // Prepare metrics for FinancialOverview
  const financialMetrics: FinancialMetric[] = [
    {
      title: "Remaining",
      amount: remaining,
      ...calculateChange(remaining, previousRemaining),
    },
    {
      title: "Income",
      amount: income,
      ...calculateChange(income, previousIncome),
    },
    {
      title: "Expenses",
      amount: Math.abs(expenses), // Display expenses as positive for better UX
      ...calculateChange(Math.abs(expenses), Math.abs(previousExpenses)),
    },
  ];

  // Prepare data for charts
  // TransactionsSection: pass transactions
  // CategoriesSection: aggregate by category with absolute values
  const categoryTotals = categories
    .map((cat) => {
      const total = transactions
        .filter((t) => t.categoryId === cat.id)
        .reduce((sum, t) => sum + Math.abs(t.amount), 0); // Use absolute values for better chart display
      return { ...cat, total };
    })
    .filter((cat) => cat.total > 0); // Only show categories with transactions

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
          Welcome Back, {session?.user.name || "User"} 👋
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          This is your Financial Overview Report
        </p>
      </div>

      <FilterDropdowns
        accounts={accounts}
        selectedAccountId={accountId}
        selectedPeriod={period}
        dateRange={{ from, to }}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <FinancialOverview metrics={financialMetrics} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <TransactionsSection transactions={transactions} />
        <CategoriesSection categories={categoryTotals} />
      </div>
    </>
  );
}
