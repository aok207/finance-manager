"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, BarChart3 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMemo, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
} from "recharts";

export type Transaction = {
  id: string;
  amount: number;
  payee: string;
  accountId: string;
  categoryId?: string | null;
  note?: string | null;
  date: Date;
  createdAt: Date;
  updatedAt: Date | null;
  account: { id: string; name: string } | null;
  category: { id: string; name: string } | null;
};

interface TransactionsSectionProps {
  transactions: Transaction[];
}

type ChartType = "area" | "line" | "bar";

export default function TransactionsSection({
  transactions,
}: TransactionsSectionProps) {
  const [chartType, setChartType] = useState<ChartType>("area");

  // Process data for chart - group by date and sum amounts
  const chartData = useMemo(() => {
    const dateMap = new Map<
      string,
      { date: string; income: number; expenses: number; net: number }
    >();

    transactions.forEach((transaction) => {
      const dateStr = transaction.date.toISOString().split("T")[0]; // YYYY-MM-DD format
      const existing = dateMap.get(dateStr) || {
        date: dateStr,
        income: 0,
        expenses: 0,
        net: 0,
      };

      if (transaction.amount > 0) {
        existing.income += transaction.amount;
      } else {
        existing.expenses += Math.abs(transaction.amount);
      }
      existing.net = existing.income - existing.expenses;

      dateMap.set(dateStr, existing);
    });

    return Array.from(dateMap.values())
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map((item) => ({
        ...item,
        date: new Date(item.date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
      }));
  }, [transactions]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "MMK",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const renderChart = () => {
    if (chartData.length === 0) {
      return (
        <div className="h-64 flex items-center justify-center">
          <div className="text-center text-slate-500 dark:text-slate-400">
            <BarChart3 className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No transaction data available</p>
          </div>
        </div>
      );
    }

    const commonProps = {
      width: 500,
      height: 300,
      data: chartData,
      margin: { top: 5, right: 30, left: 20, bottom: 5 },
    };

    switch (chartType) {
      case "area":
        return (
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={formatCurrency}
              />
              <Tooltip
                formatter={(value: number, name: string) => [
                  formatCurrency(value),
                  name,
                ]}
                labelClassName="text-slate-600"
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
              />
              <Area
                type="monotone"
                dataKey="income"
                stackId="1"
                stroke="#10b981"
                fill="#10b981"
                fillOpacity={0.3}
                name="Income"
              />
              <Area
                type="monotone"
                dataKey="expenses"
                stackId="2"
                stroke="#ef4444"
                fill="#ef4444"
                fillOpacity={0.3}
                name="Expenses"
              />
            </AreaChart>
          </ResponsiveContainer>
        );

      case "line":
        return (
          <ResponsiveContainer width="100%" height={250}>
            <LineChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={formatCurrency}
              />
              <Tooltip
                formatter={(value: number, name: string) => [
                  formatCurrency(value),
                  name,
                ]}
                labelClassName="text-slate-600"
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
              />
              <Line
                type="monotone"
                dataKey="income"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
                name="Income"
              />
              <Line
                type="monotone"
                dataKey="expenses"
                stroke="#ef4444"
                strokeWidth={2}
                dot={{ fill: "#ef4444", strokeWidth: 2, r: 4 }}
                name="Expenses"
              />
              <Line
                type="monotone"
                dataKey="net"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
                name="Net"
              />
            </LineChart>
          </ResponsiveContainer>
        );

      case "bar":
        return (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={formatCurrency}
              />
              <Tooltip
                formatter={(value: number, name: string) => [
                  formatCurrency(value),
                  name,
                ]}
                labelClassName="text-slate-600"
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
              />
              <Bar
                dataKey="income"
                fill="#10b981"
                name="Income"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="expenses"
                fill="#ef4444"
                name="Expenses"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        );

      default:
        return null;
    }
  };

  const getChartTypeLabel = () => {
    switch (chartType) {
      case "area":
        return "Area chart";
      case "line":
        return "Line chart";
      case "bar":
        return "Bar chart";
    }
  };
  return (
    <Card className="shadow-sm border-0 bg-white dark:bg-slate-800">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">
            Transactions
          </CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="text-slate-600 dark:text-slate-300"
              >
                <BarChart3 className="mr-2 h-4 w-4" />
                {getChartTypeLabel()}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setChartType("area")}>
                Area chart
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setChartType("line")}>
                Line chart
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setChartType("bar")}>
                Bar chart
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>{renderChart()}</CardContent>
    </Card>
  );
}
