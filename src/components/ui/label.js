import React, { forwardRef } from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import { cn } from "../lib/utils"; // adjust if path is different

const Label = forwardRef((props, ref) => {
  return (
    <LabelPrimitive.Root
      ref={ref}
      className={cn(
        "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        props.className
      )}
      {...props}
    />
  );
});

Label.displayName = "Label";

export { Label };
