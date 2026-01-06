"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  PieChart,
  Settings,
  TrendingUp,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navigationItems = [
  { name: "Overview", href: "/", icon: BarChart3, active: true },
  {
    name: "Transactions",
    href: "/transactions",
    icon: TrendingUp,
  },
  { name: "Accounts", href: "/accounts", icon: Wallet },
  { name: "Categories", href: "/categories", icon: PieChart },
];

export default function DashboardNavigation() {
  const pathname = usePathname();

  return (
    <nav>
      <div className="container mx-auto px-6">
        <div className="flex space-x-1">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href;

            const Icon = item.icon;
            return (
              <Button
                key={item.name}
                variant={"ghost"}
                className={cn(
                  "text-slate-600 dark:text-slate-400 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-all duration-200",
                  isActive && "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                )}
              >
                <Link href={item.href} className="flex items-center">
                  <Icon className="mr-2 h-4 w-4" />
                  {item.name}
                </Link>
              </Button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
