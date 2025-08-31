"use server";

import { db } from "@/db";
import { category } from "@/db/schemas/category-schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { eq, and, inArray } from "drizzle-orm";

export async function createCategory(name: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      throw new Error("Unauthorized");
    }

    const newCategory = await db
      .insert(category)
      .values({
        name,
        userId: session.user.id,
      })
      .returning();

    revalidatePath("/categories");
    return { success: true, category: newCategory[0] };
  } catch (error) {
    console.error("Error creating category:", error);
    return { success: false, error: "Failed to create category" };
  }
}

export async function updateCategory(id: string, name: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      throw new Error("Unauthorized");
    }

    const updatedCategory = await db
      .update(category)
      .set({
        name,
        updatedAt: new Date(),
      })
      .where(and(eq(category.id, id), eq(category.userId, session.user.id)))
      .returning();

    revalidatePath("/categories");
    return { success: true, category: updatedCategory[0] };
  } catch (error) {
    console.error("Error updating category:", error);
    return { success: false, error: "Failed to update category" };
  }
}

export async function deleteCategory(id: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      throw new Error("Unauthorized");
    }

    await db
      .delete(category)
      .where(and(eq(category.id, id), eq(category.userId, session.user.id)));

    revalidatePath("/categories");
    return { success: true };
  } catch (error) {
    console.error("Error deleting category:", error);
    return { success: false, error: "Failed to delete category" };
  }
}

export async function bulkDeleteCategories(ids: string[]) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      throw new Error("Unauthorized");
    }

    await db
      .delete(category)
      .where(
        and(eq(category.userId, session.user.id), inArray(category.id, ids))
      );

    revalidatePath("/categories");
    return { success: true };
  } catch (error) {
    console.error("Error bulk deleting categories:", error);
    return { success: false, error: "Failed to bulk delete categories" };
  }
}
