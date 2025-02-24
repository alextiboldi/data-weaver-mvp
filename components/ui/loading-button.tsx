
"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"

export interface LoadingButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean
  loadingText?: string
  text: string
}

const LoadingButton = React.forwardRef<HTMLButtonElement, LoadingButtonProps>(
  ({ className, isLoading, loadingText, text, disabled, children, ...props }, ref) => {
    return (
      <Button
        className={cn("relative", className)}
        disabled={disabled || isLoading}
        ref={ref}
        {...props}
      >
        <span className={cn("flex items-center justify-center", { "opacity-0": isLoading })}>
          {text}
          {children}
        </span>
        {isLoading && (
          <span className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            {loadingText}
          </span>
        )}
      </Button>
    )
  }
)
LoadingButton.displayName = "LoadingButton"

export { LoadingButton }
