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
  "Total Balance" | "Income" | "Expenses",
  {
    icon: React.ComponentType<any>;
    iconColor: string;
    bgGradient: string;
    accentColor: string;
  }
> = {
  "Total Balance": {
    icon: PiggyBank,
    iconColor: "text-white",
    bgGradient: "from-violet-500 to-purple-600",
    accentColor: "bg-violet-500/10 border-violet-500/20",
  },
  Income: {
    icon: TrendingUp,
    iconColor: "text-white",
    bgGradient: "from-emerald-500 to-teal-600",
    accentColor: "bg-emerald-500/10 border-emerald-500/20",
  },
  Expenses: {
    icon: TrendingDown,
    iconColor: "text-white",
    bgGradient: "from-rose-500 to-pink-600",
    accentColor: "bg-rose-500/10 border-rose-500/20",
  },
};

export type FinancialMetric = {
  title: "Total Balance" | "Income" | "Expenses";
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
        const { icon: Icon, iconColor, bgGradient, accentColor } = metricIcons[metric.title];
        return (
          <Card
            key={metric.title}
            className="relative overflow-hidden border border-slate-200/60 dark:border-slate-700/60 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm shadow-lg hover:shadow-xl dark:shadow-slate-900/50 dark:hover:shadow-slate-900/70 transition-all duration-300 group"
          >
            {/* Decorative gradient overlay */}
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${bgGradient} opacity-5 dark:opacity-10 rounded-full blur-2xl group-hover:opacity-10 dark:group-hover:opacity-20 transition-opacity duration-300`}></div>
            
            <CardHeader className="pb-3 relative">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold text-slate-600 dark:text-slate-300 uppercase tracking-wide">
                  {metric.title}
                </CardTitle>
                <div className={`p-2.5 rounded-xl bg-gradient-to-br ${bgGradient} shadow-lg dark:shadow-lg dark:shadow-purple-900/20`}>
                  <Icon className={`h-5 w-5 ${iconColor}`} />
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0 relative">
              <div className="space-y-3">
                <p className="text-3xl font-bold text-slate-900 dark:text-slate-50 tracking-tight">
                  {formatMMK(metric.amount)}
                </p>
                <div className={`inline-flex items-center px-2.5 py-1 rounded-full border ${accentColor} dark:bg-opacity-20`}>
                  <p
                    className={`text-xs font-semibold ${
                      metric.changeType === "positive"
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-rose-600 dark:text-rose-400"
                    }`}
                  >
                    {metric.change}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </>
  );
}
