"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createAccount } from "@/modules/accounts/api/actions";
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
import { useFormSubmission } from "@/lib/hooks/use-form-submission";
import { Loader2 } from "lucide-react";

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
  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: {
      name: "",
      initialBalance: 0,
    },
  });

  const { isLoading, handleSubmit } = useFormSubmission({
    action: async (values: AccountFormValues) =>
      createAccount(values.name, values.initialBalance),
    onSuccess: () => {
      form.reset();
      onClose();
    },
    successMessage: "Account created successfully",
    errorMessage: "Failed to create account",
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-4"
      >
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
                  onChange={(e) =>
                    field.onChange(parseFloat(e.target.value) || 0)
                  }
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
            {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {isLoading ? "Creating..." : "Create Account"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
