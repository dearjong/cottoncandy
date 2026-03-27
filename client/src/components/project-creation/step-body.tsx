import { motion } from "framer-motion";
import { ReactNode } from "react";

interface StepBodyProps {
  title: string;
  subtitle?: ReactNode;
  guideButton?: ReactNode;
  children: ReactNode;
  className?: string;
}

export default function StepBody({
  title,
  subtitle,
  guideButton,
  children,
  className = ""
}: StepBodyProps) {
  return (
    <div className={`page-container ${className}`}>
      <div className="page-content">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="header-section"
        >
          <h1 className="page-title" dangerouslySetInnerHTML={{ __html: title }} />
          {subtitle && (
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-4">
              {subtitle}
              {guideButton}
            </div>
          )}
        </motion.div>

        {/* Content */}
        {children}
      </div>
    </div>
  );
}
