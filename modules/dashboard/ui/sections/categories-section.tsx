"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, PieChart } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";

export type CategoryTotal = {
  id: string;
  name: string;
  total: number;
};

interface CategoriesSectionProps {
  categories: CategoryTotal[];
}

type ChartType = "pie" | "donut" | "bar";

const COLORS = [
  "#3b82f6", // blue
  "#10b981", // emerald
  "#f59e0b", // amber
  "#ef4444", // red
  "#8b5cf6", // violet
  "#06b6d4", // cyan
  "#84cc16", // lime
  "#f97316", // orange
  "#ec4899", // pink
  "#6b7280", // gray
];

export default function CategoriesSection({
  categories,
}: CategoriesSectionProps) {
  const [chartType, setChartType] = useState<ChartType>("pie");

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "MMK",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const renderChart = () => {
    if (categories.length === 0) {
      return (
        <div className="h-64 flex items-center justify-center">
          <div className="text-center text-slate-500 dark:text-slate-400">
            <PieChart className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No category data available</p>
          </div>
        </div>
      );
    }

    switch (chartType) {
      case "pie":
        return (
          <ResponsiveContainer width="100%" height={250}>
            <RechartsPieChart>
              <Pie
                data={categories}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="total"
                label={({ name, percent }: any) =>
                  `${name} ${((percent as number) * 100).toFixed(0)}%`
                }
                labelLine={false}
              >
                {categories.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => [formatCurrency(value), "Total"]}
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
              />
            </RechartsPieChart>
          </ResponsiveContainer>
        );

      case "donut":
        return (
          <ResponsiveContainer width="100%" height={250}>
            <RechartsPieChart>
              <Pie
                data={categories}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                fill="#8884d8"
                dataKey="total"
                label={({ name, percent }: any) =>
                  `${name} ${((percent as number) * 100).toFixed(0)}%`
                }
                labelLine={false}
              >
                {categories.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => [formatCurrency(value), "Total"]}
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
              />
            </RechartsPieChart>
          </ResponsiveContainer>
        );

      case "bar":
        return (
          <ResponsiveContainer width="100%" height={250}>
            <BarChart
              data={categories}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={formatCurrency}
              />
              <Tooltip
                formatter={(value: number) => [formatCurrency(value), "Total"]}
                labelClassName="text-slate-600"
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
              />
              <Bar dataKey="total" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );

      default:
        return null;
    }
  };

  const getChartTypeLabel = () => {
    switch (chartType) {
      case "pie":
        return "Pie chart";
      case "donut":
        return "Donut chart";
      case "bar":
        return "Bar chart";
    }
  };
  return (
    <Card className="shadow-sm border-0 bg-white dark:bg-slate-800">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-slate-900 dark:text-white">
            Categories
          </CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="text-slate-600 dark:text-slate-300"
              >
                <PieChart className="mr-2 h-4 w-4" />
                {getChartTypeLabel()}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setChartType("pie")}>
                Pie chart
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setChartType("donut")}>
                Donut chart
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
