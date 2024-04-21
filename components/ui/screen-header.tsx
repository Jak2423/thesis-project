import { cn } from "@/lib/utils";
import React from "react";

const ScreenHeader = React.forwardRef<
   HTMLParagraphElement,
   React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
   <h1
      ref={ref}
      className={cn("flex items-center text-2xl font-semibold", className)}
      {...props}
   />
));

export { ScreenHeader };
