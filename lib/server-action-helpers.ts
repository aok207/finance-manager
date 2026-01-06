"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export interface ActionResponse<T = void> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Wrapper for server actions that require authentication.
 * Automatically handles auth checks and error formatting.
 *
 * @param handler - Async function that receives userId and returns data
 * @returns ActionResponse with success, data, or error
 *
 * @example
 * export async function createAccount(name: string) {
 *   return withAuth(async (userId) => {
 *     const result = await db.insert(balanceAccounts)
 *       .values({ name, userId })
 *       .returning();
 *     return result[0];
 *   });
 * }
 */
export async function withAuth<T>(
  handler: (userId: string) => Promise<T>
): Promise<ActionResponse<T>> {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session) {
      return {
        success: false,
        error: "Unauthorized",
      };
    }

    const data = await handler(session.user.id);

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error("Server action error:", error);

    const errorMessage =
      error instanceof Error ? error.message : "An error occurred";

    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Revalidate multiple paths at once.
 *
 * @param paths - Array of paths to revalidate
 *
 * @example
 * revalidateMultiple("/transactions", "/accounts");
 */
export async function revalidateMultiple(...paths: string[]): Promise<void> {
  paths.forEach((path) => {
    revalidatePath(path);
  });
}
