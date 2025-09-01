"use server";

import { db } from "@/db";
import { categories as categoriesSchema } from "@/db/schemas/category-schema";
import { auth } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { headers } from "next/headers";

export async function getCategories(): Promise<{
  success: boolean;
  data?: { id: string; name: string }[];
  error?: string;
}> {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    return {
      success: false,
      error: "Unauthorized",
    };
  }

  const categories = await db
    .select({ id: categoriesSchema.id, name: categoriesSchema.name })
    .from(categoriesSchema)
    .where(eq(categoriesSchema.userId, session.user.id))
    .orderBy(categoriesSchema.name);

  return {
    success: true,
    data: categories,
  };
}
