"use client";

import { Button } from "@/components/ui/button";
import { Info, MinusCircle, PlusCircle } from "lucide-react";
import React from "react";
import { Tooltip, TooltipContent } from "@/components/ui/tooltip";
import { TooltipTrigger } from "@radix-ui/react-tooltip";
import CurrencyInput from "react-currency-input-field";
import { cn } from "@/lib/utils";

type AmountInputProps = {
  disabled: boolean;
  value: number;
  onChange: (value?: number) => void;
};

function AmountInput({ disabled, value, onChange }: AmountInputProps) {
  const parsedValue = value;
  const isIncome = parsedValue > 0;
  const isExpense = parsedValue < 0;

  // Handle toggle between positive and negative
  const handleReverseValue = () => {
    if (!value) {
      return;
    }
    onChange(value * -1);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant={isExpense ? "destructive" : "outline"}
              size="icon"
              onClick={handleReverseValue}
              disabled={disabled}
              tabIndex={-1}
              aria-label={isExpense ? "Set as income" : "Set as expense"}
            >
              {!parsedValue && <Info className="w-4 h-4" />}
              {isExpense && <MinusCircle className="w-4 h-4" />}
              {isIncome && <PlusCircle className="w-4 h-4" />}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            [+] to set as income, [-] to set as expense
          </TooltipContent>
        </Tooltip>
        <CurrencyInput
          value={value}
          onValueChange={(value) => {
            onChange(value ? parseFloat(value) : undefined);
          }}
          placeholder="Enter amount"
          decimalsLimit={3}
          decimalScale={2}
          disabled={disabled}
          className={cn(
            "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
            "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive"
          )}
        />
      </div>

      <span className="text-xs text-muted-foreground">
        {isIncome ? "This will count as income" : "This will count as expense"}
      </span>
    </div>
  );
}

export default AmountInput;
