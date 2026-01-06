"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ApiResponse } from "@/types/api";

interface UseFormSubmissionOptions<T> {
  /**
   * Server action to call on form submission
   */
  action: (data: T) => Promise<ApiResponse>;

  /**
   * Callback to run after successful submission
   */
  onSuccess?: () => void;

  /**
   * Success message to display (default: "Success")
   */
  successMessage?: string;

  /**
   * Error message to display when no specific error is provided (default: "Failed")
   */
  errorMessage?: string;

  /**
   * Whether to refresh the page after successful submission (default: true)
   */
  refreshOnSuccess?: boolean;

  /**
   * Whether to reset the form after successful submission (requires passing form.reset)
   */
  resetOnSuccess?: boolean;
}

interface UseFormSubmissionReturn<T> {
  /**
   * Loading state
   */
  isLoading: boolean;

  /**
   * Form submission handler
   */
  handleSubmit: (values: T) => Promise<void>;
}

/**
 * Custom hook to handle form submission with consistent error handling and loading states
 *
 * @example
 * const { isLoading, handleSubmit } = useFormSubmission({
 *   action: createAccount,
 *   onSuccess: () => {
 *     form.reset();
 *     onClose();
 *   },
 *   successMessage: "Account created successfully",
 *   errorMessage: "Failed to create account",
 * });
 *
 * const onSubmit = form.handleSubmit(handleSubmit);
 */
export function useFormSubmission<T>({
  action,
  onSuccess,
  successMessage = "Success",
  errorMessage = "Failed",
  refreshOnSuccess = true,
  resetOnSuccess = false,
}: UseFormSubmissionOptions<T>): UseFormSubmissionReturn<T> {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (values: T) => {
    setIsLoading(true);

    try {
      const result = await action(values);

      if (result.success) {
        toast.success(successMessage);

        // Call onSuccess callback first (e.g., form.reset, onClose)
        onSuccess?.();

        // Then refresh if needed
        if (refreshOnSuccess) {
          router.refresh();
        }
      } else {
        toast.error(result.error || errorMessage);
      }
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    handleSubmit,
  };
}
