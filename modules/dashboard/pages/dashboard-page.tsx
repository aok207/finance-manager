import FilterDropdowns from "../ui/components/filter-dropdowns";
import FinancialOverview from "../ui/sections/financial-overview";
import TransactionsSection from "../ui/sections/transactions-section";
import CategoriesSection from "../ui/sections/categories-section";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function DashboardPage() {
  const session = await auth.api.getSession({
    headers: await headers(), // you need to pass the headers object.
  });

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

      <FilterDropdowns />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <FinancialOverview />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <TransactionsSection />
        <CategoriesSection />
      </div>
    </>
  );
}
