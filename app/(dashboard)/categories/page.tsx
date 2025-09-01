import { redirect } from "next/navigation";
import CategoriesPage from "@/modules/categories/pages/categories-page";
import { getCategories } from "@/modules/categories/api/queries";

export default async function Categories() {
  const { data: categories, success } = await getCategories();

  if (!success) {
    redirect("/login");
  }

  return <CategoriesPage categories={categories!} />;
}
