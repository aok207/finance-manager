import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, PiggyBank, TrendingUp, TrendingDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const financialMetrics = [
  {
    title: "Remaining",
    amount: "$1,167.46",
    change: "-10% from last period",
    changeType: "negative" as const,
    icon: PiggyBank,
    iconColor: "text-blue-500",
    bgColor: "bg-blue-50 dark:bg-blue-950/30",
  },
  {
    title: "Income",
    amount: "$5,226.12",
    change: "18% from last period",
    changeType: "positive" as const,
    icon: TrendingUp,
    iconColor: "text-emerald-500",
    bgColor: "bg-emerald-50 dark:bg-emerald-950/30",
  },
  {
    title: "Expenses",
    amount: "-$3,814.27",
    change: "33% from last period",
    changeType: "negative" as const,
    icon: TrendingDown,
    iconColor: "text-rose-500",
    bgColor: "bg-rose-50 dark:bg-rose-950/30",
  },
];

export default function FinancialOverview() {
  return (
    <>
      {financialMetrics.map((metric) => {
        const Icon = metric.icon;
        return (
          <Card
            key={metric.title}
            className="shadow-sm border-0 bg-white dark:bg-slate-800"
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400">
                  {metric.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${metric.bgColor}`}>
                  <Icon className={`h-5 w-5 ${metric.iconColor}`} />
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {metric.amount}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Apr 04 - May 04, 2024
                </p>
                <p
                  className={`text-sm font-medium ${
                    metric.changeType === "positive"
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-rose-600 dark:text-rose-400"
                  }`}
                >
                  {metric.change}
                </p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </>
  );
}
