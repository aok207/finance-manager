import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, PiggyBank, TrendingUp, TrendingDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const metricIcons: Record<
  "Remaining" | "Income" | "Expenses",
  {
    icon: React.ComponentType<any>;
    iconColor: string;
    bgColor: string;
  }
> = {
  Remaining: {
    icon: PiggyBank,
    iconColor: "text-blue-500",
    bgColor: "bg-blue-50 dark:bg-blue-950/30",
  },
  Income: {
    icon: TrendingUp,
    iconColor: "text-emerald-500",
    bgColor: "bg-emerald-50 dark:bg-emerald-950/30",
  },
  Expenses: {
    icon: TrendingDown,
    iconColor: "text-rose-500",
    bgColor: "bg-rose-50 dark:bg-rose-950/30",
  },
};

export type FinancialMetric = {
  title: "Remaining" | "Income" | "Expenses";
  amount: number;
  change: string;
  changeType: string;
};

interface FinancialOverviewProps {
  metrics: FinancialMetric[];
}

const formatMMK = (amount: number) => {
  return amount.toLocaleString("en-US", { style: "currency", currency: "MMK" });
};

export default function FinancialOverview({ metrics }: FinancialOverviewProps) {
  return (
    <>
      {metrics.map((metric) => {
        const { icon: Icon, iconColor, bgColor } = metricIcons[metric.title];
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
                <div className={`p-2 rounded-lg ${bgColor}`}>
                  <Icon className={`h-5 w-5 ${iconColor}`} />
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {formatMMK(metric.amount)}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {/* TODO: Show selected date range */}
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
