import React, { forwardRef } from "react";
import * as SeparatorPrimitive from "@radix-ui/react-separator";

// Utility function to combine class names
const cn = (...classes) => classes.filter(Boolean).join(" ");

const Separator = forwardRef(
  ({ className, orientation = "horizontal", decorative = true, ...props }, ref) => (
    <SeparatorPrimitive.Root
      ref={ref}
      decorative={decorative}
      orientation={orientation}
      className={cn(
        "shrink-0 bg-border",
        orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
        className
      )}
      {...props}
    />
  )
);

Separator.displayName = SeparatorPrimitive.Root.displayName;

export { Separator };
