import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  id?: string;
}

const InputSelect = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        ref={ref}
        className={cn(
          "flex h-11 w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-sm",
          "placeholder:text-gray-400",
          "focus:outline-none focus:ring-2 focus:ring-uaBlue focus:border-uaBlue",
          "disabled:cursor-not-allowed disabled:opacity-50",
          "transition-colors",
          className
        )}
        {...props}
      />
    );
  }
);

InputSelect.displayName = "InputSelect";

export { InputSelect };
