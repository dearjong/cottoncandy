import { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

interface ProjectButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "pink" | "white";
}

const ProjectButton = forwardRef<HTMLButtonElement, ProjectButtonProps>(
  ({ className, variant = "white", children, ...props }, ref) => {
    const variantClass = variant === "pink" ? "btn-pink" : "btn-white";
    
    return (
      <button
        ref={ref}
        className={cn(variantClass, className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);

ProjectButton.displayName = "ProjectButton";

export default ProjectButton;
