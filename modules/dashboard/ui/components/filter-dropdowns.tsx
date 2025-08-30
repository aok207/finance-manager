import { Button } from "@/components/ui/button";
import { ChevronDown, Calendar, Wallet } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function FilterDropdowns() {
  return (
    <div className="flex flex-wrap gap-4 mb-6">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
          >
            <Wallet className="mr-2 h-4 w-4" />
            All accounts
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>All accounts</DropdownMenuItem>
          <DropdownMenuItem>Checking Account</DropdownMenuItem>
          <DropdownMenuItem>Savings Account</DropdownMenuItem>
          <DropdownMenuItem>Credit Card</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700"
          >
            <Calendar className="mr-2 h-4 w-4" />
            Apr 04 - May 04, 2024
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem>Last 7 days</DropdownMenuItem>
          <DropdownMenuItem>Last 30 days</DropdownMenuItem>
          <DropdownMenuItem>Last 3 months</DropdownMenuItem>
          <DropdownMenuItem>Last 6 months</DropdownMenuItem>
          <DropdownMenuItem>Last year</DropdownMenuItem>
          <DropdownMenuItem>Custom range</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
