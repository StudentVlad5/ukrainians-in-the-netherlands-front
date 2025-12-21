import React from "react";

type ButtonVariant = "primary" | "secondary" | "danger";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  isLoading?: boolean;
  variant?: ButtonVariant;
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      className = "",
      isLoading,
      variant = "primary",
      disabled,
      ...props
    },
    ref
  ) => {
    const VARIANT_STYLES: Record<ButtonVariant, string> = {
      primary: "bg-blue-600 hover:bg-blue-700 text-white",
      secondary: "bg-gray-200 hover:bg-gray-300 text-gray-800",
      danger: "bg-red-600 hover:bg-red-700 text-white",
    };
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`
          w-full flex justify-center items-center py-2 px-4 rounded-md
          text-sm font-medium shadow-sm transition
          focus:outline-none focus:ring-2 focus:ring-offset-2
          ${VARIANT_STYLES[variant]}
          ${disabled || isLoading ? "opacity-50 cursor-not-allowed" : ""}
          ${className}
        `}
        {...props}
      >
        {isLoading ? (
          <svg className="animate-spin h-5 w-5 text-current" />
        ) : (
          children
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
