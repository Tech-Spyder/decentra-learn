import { cn } from "@/utils";
import React from "react";


type CardProps = React.HTMLAttributes<HTMLDivElement>;

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("rounded-3xl bg-new-tertiary p-6 border border-border", className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";
