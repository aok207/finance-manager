import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, BarChart3 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function TransactionsSection() {
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
                Area chart
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Area chart</DropdownMenuItem>
              <DropdownMenuItem>Line chart</DropdownMenuItem>
              <DropdownMenuItem>Bar chart</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-64 bg-slate-50 dark:bg-slate-700 rounded-lg flex items-center justify-center">
          <div className="text-center text-slate-500 dark:text-slate-400">
            <BarChart3 className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Transactions chart will appear here</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
