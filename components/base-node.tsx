import React from "react";
import { cn } from "@/lib/utils";

export const BaseNode = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    selected?: boolean;
    isHighlighted?: boolean;
  }
>(({ className, selected, isHighlighted, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "relative rounded-md border bg-card p-5 text-card-foreground",
      className,
      selected ? "border-4 border-gray-600 shadow-lg" : "",
      isHighlighted && "bg-yellow-50 dark:bg-yellow-900/20",
      "hover:ring-1"
    )}
    tabIndex={0}
    {...props}
  ></div>
));
BaseNode.displayName = "BaseNode";
