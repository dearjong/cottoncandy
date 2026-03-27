import { ReactNode } from "react";
import { X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface ProjectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string;
  description?: string;
  children: ReactNode;
  maxWidth?: string;
}

export default function ProjectModal({
  open,
  onOpenChange,
  title,
  description,
  children,
  maxWidth = "max-w-4xl"
}: ProjectModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`${maxWidth} max-h-[90vh] overflow-y-auto p-0`}>
        {/* Modal Header */}
        {(title || description) && (
          <DialogHeader className="p-6 pb-4 border-b border-gray-200 sticky top-0 bg-white z-10">
            {title && (
              <DialogTitle className="text-xl font-bold text-gray-800">
                {title}
              </DialogTitle>
            )}
            {description && (
              <DialogDescription className="text-sm text-gray-600 mt-2">
                {description}
              </DialogDescription>
            )}
          </DialogHeader>
        )}

        {/* Modal Body */}
        <div className="p-6">
          {children}
        </div>

        {/* Close Button */}
        <button
          onClick={() => onOpenChange(false)}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
          aria-label="닫기"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </DialogContent>
    </Dialog>
  );
}
