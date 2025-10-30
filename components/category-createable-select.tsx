"use client";

import { createCategory } from "@/modules/categories/api/actions";
import React, { useState } from "react";
import { toast } from "sonner";
import { CreatableSelect } from "./ui/createable-select";

type CategoryCreatableSelectProps = {
  initialCategoryOptions: { label: string; value: string }[];
  value?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
};

function CategoryCreatableSelect(props: CategoryCreatableSelectProps) {
  const [categoryOptions, setCategoryOptions] = useState(
    props.initialCategoryOptions
  );

  const handleCreateCategory = async (
    name: string
  ): Promise<string | undefined> => {
    try {
      const result = await createCategory(name);

      if (result.success && result.category) {
        const newCategory = {
          label: result.category.name,
          value: result.category.id,
        };
        setCategoryOptions((prev) => [...prev, newCategory]);
        toast.success("Category created successfully");
        return result.category.id;
      } else {
        toast.error(result.error || "Failed to create category");
        return undefined;
      }
    } catch (error) {
      toast.error("An unexpected error occurred while creating category");
      return undefined;
    }
  };
  return (
    <CreatableSelect
      options={categoryOptions}
      value={props.value}
      onValueChange={props.onChange}
      onCreateOption={handleCreateCategory}
      placeholder="Select category..."
      searchPlaceholder="Search categories..."
      createLabel="Create category"
      disabled={props.disabled}
    />
  );
}

export default CategoryCreatableSelect;
