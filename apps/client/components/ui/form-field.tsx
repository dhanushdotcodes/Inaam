import React from "react";
import { cn } from "@/lib/utils";

interface FormFieldProps {
  label: string;
  children: React.ReactNode;
  rightElement?: React.ReactNode;
  error?: React.ReactNode;
  className?: string;
  labelClassName?: string;
  required?: boolean;
}

/**
 * FormField component — A reusable wrapper for form inputs with a label and optional right element/error.
 * Follows the project standard of gap-1 between label and input.
 */
export function FormField({
  label,
  children,
  rightElement,
  error,
  className,
  labelClassName,
  required,
}: FormFieldProps) {
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <div className="flex justify-between items-center">
        <label className={cn("pl-1 text-sm font-medium", labelClassName)}>
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </label>
        {rightElement}
      </div>
      {children}
      {error}
    </div>
  );
}
