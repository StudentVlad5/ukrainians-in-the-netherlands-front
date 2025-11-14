import React from "react";

type CardProps = React.HTMLAttributes<HTMLDivElement>;

export function Card({ className, children, ...props }: CardProps) {
  return (
    <div className={`rounded-2xl border p-4 shadow ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardContent({ className, children, ...props }: CardProps) {
  return (
    <div className={className} {...props}>
      {children}
    </div>
  );
}
