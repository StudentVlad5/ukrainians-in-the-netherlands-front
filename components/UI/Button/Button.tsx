import React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  isLoading?: boolean;
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, className, isLoading, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={isLoading}
        className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
                   bg-blue-600 hover:bg-blue-700 
                   focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                   ${isLoading ? "opacity-50 cursor-not-allowed" : ""}
                   ${className}`}
        {...props}
      >
        {isLoading ? (
          <svg
            className="animate-spin h-5 w-5 text-white" /* ... іконка спінера ... */
          ></svg>
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
