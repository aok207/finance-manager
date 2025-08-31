import { redirect } from "next/navigation";
import CategoriesPage from "@/modules/categories/pages/categories-page";
import { getCategories } from "@/modules/categories/api/queries";

interface CategoriesPageProps {
  searchParams: Promise<{
    query?: string;
    page?: string;
    pageSize?: string;
  }>;
}

export default async function Categories({ searchParams }: CategoriesPageProps) {
  const { data: categories, success } = await getCategories();

  if (!success) {
    redirect("/login");
  }

  return <CategoriesPage categories={categories!} />;
}
