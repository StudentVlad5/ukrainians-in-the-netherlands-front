import React from "react";

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export function Textarea({ className, ...props }: TextareaProps) {
  return (
    <textarea
      className={`border rounded-xl p-3 w-full ${className}`}
      {...props}
    />
  );
}
