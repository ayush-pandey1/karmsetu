import * as React from "react"

import { cn } from "@/lib/utils"
import "../../app/globals.css"

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    (<input
      type={type}
      className={cn(
        "flex h-9 font-inter font-medium w-full  border-b border-stroke bg-transparent px-0 py-1  text-sm  transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:font-inter placeholder:font-medium  placeholder:text-neutral-500     focus-visible:ring-neutral-950 disabled:cursor-not-allowed disabled:opacity-50  dark:placeholder:text-neutral-400 dark:focus-visible:ring-neutral-300 focus:border-waterloo focus:placeholder:text-black focus-visible:outline-none dark:border-strokedark dark:focus:border-manatee dark:focus:placeholder:text-white",
        className
      )}
      ref={ref}
      {...props} />)
  );
})
Input.displayName = "Input"

export { Input }
