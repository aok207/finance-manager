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

// Custom Tooltip Component for dark mode support
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg p-3">
        <p className="text-sm font-medium text-slate-900 dark:text-slate-100 mb-2">{label || payload[0].name}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: entry.color || entry.payload?.fill }}
            />
            <span className="text-slate-600 dark:text-slate-400">{entry.name || "Total"}:</span>
            <span className="font-semibold text-slate-900 dark:text-slate-100">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

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
              <Tooltip content={<CustomTooltip />} />
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
              <Tooltip content={<CustomTooltip />} />
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
              <Tooltip content={<CustomTooltip />} />
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
    <Card className="border border-slate-200/60 dark:border-slate-700/60 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm shadow-lg hover:shadow-xl dark:shadow-slate-900/50 dark:hover:shadow-slate-900/70 transition-all duration-300">
      <CardHeader className="pb-4 border-b border-slate-100 dark:border-slate-700/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 shadow-md dark:shadow-purple-900/30">
              <PieChart className="h-5 w-5 text-white" />
            </div>
            <CardTitle className="text-lg font-bold text-slate-900 dark:text-slate-50">
              Spending by Category
            </CardTitle>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800"
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
      <CardContent className="pt-6">{renderChart()}</CardContent>
    </Card>
  );
}
