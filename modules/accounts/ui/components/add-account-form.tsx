"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createAccount } from "@/modules/accounts/api/actions";
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

const accountFormSchema = z.object({
  name: z
    .string()
    .min(1, "Account name is required")
    .min(2, "Account name must be at least 2 characters")
    .max(50, "Account name must be less than 50 characters")
    .trim(),
  initialBalance: z.number(),
});

type AccountFormValues = z.infer<typeof accountFormSchema>;

interface AddAccountFormProps {
  onClose: () => void;
}

export function AddAccountForm({ onClose }: AddAccountFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: {
      name: "",
      initialBalance: 0,
    },
  });

  const onSubmit = async (values: AccountFormValues) => {
    setIsLoading(true);

    try {
      const result = await createAccount(values.name, values.initialBalance);

      if (result.success) {
        toast.success("Account created successfully");
        form.reset();
        onClose();
        router.refresh();
      } else {
        toast.error(result.error || "Failed to create account");
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
          name="initialBalance"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Initial Balance</FormLabel>
              <FormDescription>
                Enter the starting balance for this account (optional)
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
            {isLoading ? "Creating..." : "Create Account"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
