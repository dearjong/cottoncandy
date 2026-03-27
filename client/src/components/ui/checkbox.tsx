import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { Check } from "lucide-react"

import { cn } from "@/lib/utils"

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => {
  const [isChecked, setIsChecked] = React.useState(props.checked || false);

  React.useEffect(() => {
    setIsChecked(props.checked || false);
  }, [props.checked]);

  return (
    <div className={cn(
      "inline-flex p-1 -m-1 rounded transition-colors",
      !props.disabled && "hover:bg-gray-100"
    )}>
      <CheckboxPrimitive.Root
        ref={ref}
        className={cn(
          "peer h-[18px] w-[18px] shrink-0 rounded ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 data-[state=checked]:bg-cotton-candy-pink data-[state=checked]:text-white",
          className
        )}
        style={{
          boxShadow: isChecked ? 'inset 0 0 0 1.5px #EA4C89' : 'inset 0 0 0 1.5px rgb(209 213 219)'
        }}
        onCheckedChange={(checked) => {
          setIsChecked(!!checked);
          props.onCheckedChange?.(checked);
        }}
        {...props}
      >
        <CheckboxPrimitive.Indicator
          className={cn("flex items-center justify-center text-current")}
        >
          <Check className="h-3.5 w-3.5 stroke-[3]" />
        </CheckboxPrimitive.Indicator>
      </CheckboxPrimitive.Root>
    </div>
  );
})
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox }
