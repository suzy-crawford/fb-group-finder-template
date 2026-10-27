import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    (<input
      type={type}
      className={cn(
        "flex min-h-11 w-full rounded-sm border-[1.5px] border-app-border-strong bg-app-raised px-3 py-2 text-base text-app-text file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-app-muted disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props} />)
  );
})
Input.displayName = "Input"

export { Input }
