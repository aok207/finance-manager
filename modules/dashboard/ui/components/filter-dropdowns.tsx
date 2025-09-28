"use client";

import { Button } from "@/components/ui/button";
import { ChevronDown, Calendar, Wallet, CalendarIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { DateRange } from "react-day-picker";
import { format } from "date-fns";

interface FilterDropdownsProps {
  accounts: { id: string; name: string }[];
  selectedAccountId: string;
  selectedPeriod: string;
  dateRange: { from: Date; to: Date };
}

const PERIOD_OPTIONS = {
  "7days": "Last 7 days",
  "30days": "Last 30 days",
  "3months": "Last 3 months",
  "6months": "Last 6 months",
  "1year": "Last year",
} as const;

export default function FilterDropdowns({
  accounts,
  selectedAccountId,
  selectedPeriod,
  dateRange,
}: FilterDropdownsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isCustomRangeOpen, setIsCustomRangeOpen] = useState(false);
  const [tempDateRange, setTempDateRange] = useState<DateRange | undefined>({
    from: dateRange.from,
    to: dateRange.to,
  });

  // Check if custom dates are being used by looking at URL params
  const hasCustomDates = searchParams.get("from") && searchParams.get("to");
  const isCustomPeriod = hasCustomDates;

  const updateSearchParam = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (key === "period") {
      // When switching to a predefined period, remove custom date params
      params.delete("from");
      params.delete("to");

      if (value === "30days") {
        params.delete("period"); // Remove period param for default 30days
      } else {
        params.set("period", value);
      }
    } else {
      if (value === "" || value === "30days") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    }

    router.push(`?${params.toString()}`);
  };

  const updateDateRange = (from: Date, to: Date) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("from", format(from, "yyyy-MM-dd"));
    params.set("to", format(to, "yyyy-MM-dd"));
    params.delete("period"); // Remove period when using custom dates
    router.push(`?${params.toString()}`);
    setIsCustomRangeOpen(false);
  };

  const handleCustomRangeApply = () => {
    if (tempDateRange?.from && tempDateRange?.to) {
      updateDateRange(tempDateRange.from, tempDateRange.to);
    }
  };

  const selectedAccount = accounts.find((acc) => acc.id === selectedAccountId);
  const accountDisplayName = selectedAccount?.name || "All accounts";

  const formatDateRange = (from: Date, to: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      month: "short",
      day: "2-digit",
    };
    return `${from.toLocaleDateString(
      "en-US",
      options
    )} - ${to.toLocaleDateString("en-US", options)}, ${to.getFullYear()}`;
  };

  const getDateRangeDisplayText = () => {
    if (isCustomPeriod) {
      return formatDateRange(dateRange.from, dateRange.to);
    }
    return (
      PERIOD_OPTIONS[selectedPeriod as keyof typeof PERIOD_OPTIONS] ||
      formatDateRange(dateRange.from, dateRange.to)
    );
  };

  return (
    <div className="flex flex-wrap gap-4 mb-6">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
          >
            <Wallet className="mr-2 h-4 w-4" />
            {accountDisplayName}
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            onClick={() => updateSearchParam("accountId", "")}
            className={
              selectedAccountId === "" ? "bg-slate-100 dark:bg-slate-700" : ""
            }
          >
            All accounts
          </DropdownMenuItem>
          {accounts.map((account) => (
            <DropdownMenuItem
              key={account.id}
              onClick={() => updateSearchParam("accountId", account.id)}
              className={
                selectedAccountId === account.id
                  ? "bg-slate-100 dark:bg-slate-700"
                  : ""
              }
            >
              {account.name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
          >
            <Calendar className="mr-2 h-4 w-4" />
            {getDateRangeDisplayText()}
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {Object.entries(PERIOD_OPTIONS).map(([value, label]) => (
            <DropdownMenuItem
              key={value}
              onClick={() => updateSearchParam("period", value)}
              className={
                selectedPeriod === value && !isCustomPeriod
                  ? "bg-slate-100 dark:bg-slate-700"
                  : ""
              }
            >
              {label}
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <div className="px-2 py-1.5">
            <Popover
              open={isCustomRangeOpen}
              onOpenChange={setIsCustomRangeOpen}
            >
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  className={`w-full justify-start font-normal ${
                    isCustomPeriod ? "bg-slate-100 dark:bg-slate-700" : ""
                  }`}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  Custom range
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="range"
                  defaultMonth={tempDateRange?.from}
                  selected={tempDateRange}
                  onSelect={setTempDateRange}
                  numberOfMonths={2}
                />
                <div className="p-3 border-t">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex-1 text-sm text-muted-foreground">
                      {tempDateRange?.from && tempDateRange?.to
                        ? `${format(tempDateRange.from, "MMM dd")} - ${format(
                            tempDateRange.to,
                            "MMM dd, yyyy"
                          )}`
                        : "Select date range"}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setTempDateRange({
                            from: dateRange.from,
                            to: dateRange.to,
                          });
                          setIsCustomRangeOpen(false);
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        onClick={handleCustomRangeApply}
                        disabled={!tempDateRange?.from || !tempDateRange?.to}
                      >
                        Apply
                      </Button>
                    </div>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
