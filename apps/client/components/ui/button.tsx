"use client"

import * as React from "react"
import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"
import { motion, AnimatePresence } from "motion/react"
import { Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center whitespace-nowrap transition-all outline-none select-none disabled:pointer-events-none disabled:opacity-40 border-[1.5px] font-medium tracking-tight",
  {
    variants: {
      variant: {
        contained: 
          "bg-primary border-primary text-primary-foreground hover:bg-primary/90 hover:border-primary/90 active:scale-[0.98]",
        outlined: 
          "bg-transparent border-border text-foreground hover:bg-muted/50 active:bg-muted active:scale-[0.98]",
        texted: 
          "bg-transparent border-transparent text-foreground hover:bg-muted/50 active:bg-muted active:scale-[0.98]",
        // Backward compatibility aliases
        default: "bg-primary border-primary text-primary-foreground hover:bg-primary/90 hover:border-primary/90 active:scale-[0.98]",
        outline: "bg-transparent border-border text-foreground hover:bg-muted/50 active:bg-muted active:scale-[0.98]",
        ghost: "bg-transparent border-transparent text-foreground hover:bg-muted/50 active:bg-muted active:scale-[0.98]",
        secondary: "bg-transparent border-border text-foreground hover:bg-muted/50 active:bg-muted active:scale-[0.98]",
        destructive: "bg-destructive border-destructive text-white hover:bg-destructive/90 active:scale-[0.98]",
      },
      size: {
        default: "h-[48px] rounded-xl text-sm",
        icon: "size-[48px] rounded-xl p-0",
      },
    },
    defaultVariants: {
      variant: "contained",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ComponentProps<typeof ButtonPrimitive>,
    VariantProps<typeof buttonVariants> {
  isLoading?: boolean
  startIcon?: React.ReactNode
  endIcon?: React.ReactNode
}

function Button({
  className,
  variant,
  size,
  isLoading,
  startIcon,
  endIcon,
  children,
  ...props
}: ButtonProps) {
  const isIconOnly = size === "icon" || (!children && (startIcon || endIcon))
  
  // Padding logic from guidelines
  const paddingClass = isIconOnly 
    ? "" 
    : (startIcon || endIcon) 
      ? "px-6 gap-1" 
      : "px-[30px]"

  return (
    <ButtonPrimitive
      className={cn(buttonVariants({ variant, size, className }), paddingClass)}
      disabled={isLoading || props.disabled}
      {...props}
    >
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loader"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex items-center justify-center"
          >
            <Loader2 className="size-5 animate-spin" />
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center gap-1"
          >
            {startIcon && (
              <span className="flex size-5 items-center justify-center [&_svg]:size-5">
                {startIcon}
              </span>
            )}
            {children}
            {endIcon && (
              <span className="flex size-5 items-center justify-center [&_svg]:size-5">
                {endIcon}
              </span>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </ButtonPrimitive>
  )
}

export { Button, buttonVariants }

