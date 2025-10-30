"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateTransaction } from "@/modules/transactions/api/actions";
import { createCategory } from "@/modules/categories/api/actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CreatableSelect } from "@/components/ui/createable-select";
import AmountInput from "./amount-input";
import { DatePicker } from "@/components/date-picker";
import CategoryCreatableSelect from "@/components/category-createable-select";

const transactionFormSchema = z.object({
  date: z.date({ error: "Date is required" }).min(1, "Date is required"),
  amount: z.number({ error: "Amount is required" }),
  payee: z
    .string()
    .min(1, "Payee is required")
    .max(100, "Payee must be less than 100 characters")
    .trim(),
  accountId: z.string().min(1, "Account is required"),
  categoryId: z.string(),
  note: z
    .string()
    .max(255, "Note must be less than 255 characters")
    .optional()
    .or(z.literal("")),
});

type TransactionFormValues = z.infer<typeof transactionFormSchema>;

interface EditTransactionFormProps {
  transaction: {
    id: string;
    amount: number;
    payee: string;
    accountId: string;
    categoryId?: string | null;
    note?: string | null;
    date: Date;
  };
  accountOptions: { label: string; value: string }[];
  categoryOptions: { label: string; value: string }[];
  onClose: () => void;
}

export function EditTransactionForm({
  transaction,
  accountOptions,
  categoryOptions: initialCategoryOptions,
  onClose,
}: EditTransactionFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: {
      amount: transaction.amount,
      payee: transaction.payee,
      accountId: transaction.accountId,
      categoryId: transaction.categoryId ?? "",
      note: transaction.note ?? "",
      date: transaction.date,
    },
  });

  const onSubmit = async (values: TransactionFormValues) => {
    setIsLoading(true);

    try {
      const result = await updateTransaction(transaction.id, {
        date: values.date,
        amount: values.amount,
        payee: values.payee,
        accountId: values.accountId,
        categoryId: values.categoryId,
        note: values.note || null,
      });

      if (result.success) {
        toast.success("Transaction updated successfully");
        onClose();
        router.refresh();
      } else {
        toast.error(result.error || "Failed to update transaction");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date</FormLabel>
              <FormControl>
                <DatePicker
                  value={field.value}
                  onChange={field.onChange}
                  className="w-full"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="accountId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Account</FormLabel>
              <FormControl>
                <Select
                  disabled={isLoading}
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select account" />
                  </SelectTrigger>
                  <SelectContent>
                    {accountOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="categoryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl>
                <CategoryCreatableSelect
                  initialCategoryOptions={initialCategoryOptions}
                  value={field.value}
                  onChange={field.onChange}
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount</FormLabel>
              <FormControl>
                <AmountInput
                  disabled={isLoading || form.formState.isSubmitting}
                  onChange={field.onChange}
                  value={field.value}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="payee"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Payee</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter payee"
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="note"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Note</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Optional note"
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-2 justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "Update Transaction"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
