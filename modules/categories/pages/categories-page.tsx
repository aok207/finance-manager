import React from "react";
import CategoriesTable from "../ui/components/categories-table";
import { AddCategoryDialog } from "../ui/components/add-category-dialog";

interface CategoriesPageProps {
  categories: { id: string; name: string }[];
}

const CategoriesPage = ({ categories }: CategoriesPageProps) => {
  return (
    <div className="w-full flex flex-col gap-4">
      <div className="w-full flex justify-between items-center">
        <h1 className="text-2xl font-bold text-foreground">Categories</h1>
        <AddCategoryDialog />
      </div>

      <CategoriesTable categories={categories} />
    </div>
  );
};

export default CategoriesPage;
