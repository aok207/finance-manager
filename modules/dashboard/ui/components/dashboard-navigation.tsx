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
  { name: "Settings", href: "/settings", icon: Settings },
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
                variant={item.active ? "default" : "ghost"}
                className={cn(
                  "text-white px-2 py-1 rounded-md hover:bg-accent/20 hover:text-white transition-colors duration-200",
                  isActive && "bg-accent/20"
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
