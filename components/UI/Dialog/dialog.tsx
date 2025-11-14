import React from "react";

type DialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
};

export function Dialog({ open, onOpenChange, children }: DialogProps) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      onClick={() => onOpenChange(false)}
    >
      {children}
    </div>
  );
}

type DivProps = React.HTMLAttributes<HTMLDivElement>;

export function DialogContent({ className, children, ...props }: DivProps) {
  return (
    <div
      className={`bg-white rounded-xl p-6 w-full ${className}`}
      onClick={(e) => e.stopPropagation()}
      {...props}
    >
      {children}
    </div>
  );
}

export function DialogHeader({ children, ...props }: DivProps) {
  return (
    <div className="mb-4" {...props}>
      {children}
    </div>
  );
}

export function DialogTitle({ children, ...props }: DivProps) {
  return (
    <h2 className="text-xl font-bold" {...props}>
      {children}
    </h2>
  );
}
