"use client";

import * as React from "react";
import { Check, ChevronDown, Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export interface CreatableSelectOption {
  label: string;
  value: string;
}

interface CreatableSelectProps {
  options: CreatableSelectOption[];
  value?: string;
  onValueChange?: (value: string) => void;
  onCreateOption?: (inputValue: string) => Promise<string | undefined>;
  placeholder?: string;
  searchPlaceholder?: string;
  createLabel?: string;
  disabled?: boolean;
  className?: string;
}

export function CreatableSelect({
  options,
  value,
  onValueChange,
  onCreateOption,
  placeholder = "Select option...",
  searchPlaceholder = "Search options...",
  createLabel = "Create",
  disabled = false,
  className,
}: CreatableSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const [isCreating, setIsCreating] = React.useState(false);

  const selectedOption = options.find((option) => option.value === value);
  const canCreate =
    search.length > 0 &&
    !options.some((option) => {
      const searchTerm = search.toLowerCase().trim();
      const optionLabel = option.label.toLowerCase().trim();

      // Direct comparison
      if (optionLabel === searchTerm) {
        return true;
      }

      // Normalized comparison for Unicode characters
      const normalizedSearch = searchTerm.normalize("NFD");
      const normalizedLabel = optionLabel.normalize("NFD");

      return normalizedLabel === normalizedSearch;
    });

  const handleCreate = async () => {
    if (!onCreateOption || !search.trim()) return;

    setIsCreating(true);
    try {
      const newValue = await onCreateOption(search.trim());
      if (newValue) {
        onValueChange?.(newValue);
        setOpen(false);
        setSearch("");
      }
    } finally {
      setIsCreating(false);
    }
  };

  const handleSelect = (selectedValue: string) => {
    onValueChange?.(selectedValue);
    setOpen(false);
    setSearch("");
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    onValueChange?.("");
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
          disabled={disabled}
        >
          {selectedOption ? selectedOption.label : placeholder}
          {selectedOption ? (
            <Button
              type="button"
              size={"icon"}
              variant={"ghost"}
              onClick={handleClear}
              className="shrink-0 opacity-50 hover:opacity-100 transition-opacity"
            >
              <X className="h-4 w-4" />
            </Button>
          ) : (
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <Command>
          <CommandInput
            placeholder={searchPlaceholder}
            value={search}
            onValueChange={setSearch}
          />
          <CommandEmpty className="py-0">
            <div>
              <Button
                variant="ghost"
                className="w-full justify-start text-sm font-normal"
                onClick={handleCreate}
                disabled={isCreating}
              >
                <Plus className="mr-2 h-4 w-4" />
                {isCreating ? "Creating..." : `${createLabel} "${search}"`}
              </Button>
            </div>
          </CommandEmpty>
          <CommandGroup>
            {options.map((option) => (
              <CommandItem
                key={option.value}
                value={option.label}
                onSelect={() => handleSelect(option.value)}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === option.value ? "opacity-100" : "opacity-0"
                  )}
                />
                {option.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
