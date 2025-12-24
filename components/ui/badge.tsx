import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center w-fit whitespace-nowrap shrink-0 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-colors overflow-hidden group/badge",
  {
    variants: {
      variant: {
        default: "h-5 gap-1 rounded-4xl border border-transparent px-2 py-0.5 text-xs font-medium bg-primary text-primary-foreground [a]:hover:bg-primary/80 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&>svg]:size-3!",
        secondary: "h-5 gap-1 rounded-4xl border border-transparent px-2 py-0.5 text-xs font-medium bg-secondary text-secondary-foreground [a]:hover:bg-secondary/80 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&>svg]:size-3!",
        destructive: "h-5 gap-1 rounded-4xl border border-transparent px-2 py-0.5 text-xs font-medium bg-destructive/10 [a]:hover:bg-destructive/20 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 text-destructive dark:bg-destructive/20 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&>svg]:size-3!",
        outline: "h-5 gap-1 rounded-4xl border border-border px-2 py-0.5 text-xs font-medium text-foreground [a]:hover:bg-muted [a]:hover:text-muted-foreground has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&>svg]:size-3!",
        ghost: "h-5 gap-1 rounded-4xl border border-transparent px-2 py-0.5 text-xs font-medium hover:bg-muted hover:text-muted-foreground dark:hover:bg-muted/50 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&>svg]:size-3!",
        link: "h-5 gap-1 rounded-4xl border border-transparent px-2 py-0.5 text-xs font-medium text-primary underline-offset-4 hover:underline has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&>svg]:size-3!",
        hero: "gap-3 px-3 py-1.5 rounded-full border border-[#535296] bg-white/[0.14] text-white text-sm md:text-base",
        section: "px-5 py-3 rounded-[30px] bg-[#B9B8EB]/30 text-white text-sm font-medium",
        pill: "px-6 py-3 rounded-full border border-[#B9B8EB]/40 text-white",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "span"

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
