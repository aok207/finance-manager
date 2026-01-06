"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updateAccount } from "@/modules/accounts/api/actions";
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
  FormDescription,
} from "@/components/ui/form";
import { BalanceAccount } from "@/db/schemas/account-schema";

const accountFormSchema = z.object({
  name: z
    .string()
    .min(1, "Account name is required")
    .min(2, "Account name must be at least 2 characters")
    .max(50, "Account name must be less than 50 characters")
    .trim(),
  balance: z.number(),
});

type AccountFormValues = z.infer<typeof accountFormSchema>;

interface EditAccountFormProps {
  account: { id: string; name: string; balance: number };
  onClose: () => void;
}

export function EditAccountForm({ account, onClose }: EditAccountFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: {
      name: account.name,
      balance: account.balance,
    },
  });

  const onSubmit = async (values: AccountFormValues) => {
    setIsLoading(true);

    try {
      const result = await updateAccount(account.id, values.name, values.balance);

      if (result.success) {
        toast.success("Account updated successfully");
        onClose();
        router.refresh();
      } else {
        toast.error(result.error || "Failed to update account");
      }
    } catch {
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
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Account Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter account name"
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
          name="balance"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Current Balance</FormLabel>
              <FormDescription>
                Update the current balance for this account
              </FormDescription>
              <FormControl>
                <Input
                  type="number"
                  placeholder="0"
                  disabled={isLoading}
                  {...field}
                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
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
            {isLoading ? "Updating..." : "Update Account"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
