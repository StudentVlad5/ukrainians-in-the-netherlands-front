import React from "react";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  id: string;
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, id, ...props }, ref) => {
    return (
      <div>
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
        <div className="mt-1">
          <input
            id={id}
            ref={ref}
            {...props}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400
                       focus:outline-none focus:ring-blue-500 focus:border-blue-500 
                       sm:text-sm"
          />
        </div>
      </div>
    );
  }
);

Input.displayName = "Input";
