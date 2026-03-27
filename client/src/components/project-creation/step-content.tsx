import { ReactNode } from "react";
import { motion } from "framer-motion";

interface StepContentProps {
  children: ReactNode;
  delay?: number;
}

export function StepContentSection({ children, delay = 0 }: StepContentProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay }}
      className="section-spacing"
    >
      {children}
    </motion.div>
  );
}

interface StepFormSectionProps {
  children: ReactNode;
  delay?: number;
  maxWidth?: string;
}

export function StepFormSection({ 
  children, 
  delay = 0.4,
  maxWidth = "max-w-[760px]" 
}: StepFormSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, delay }}
      className={`mb-10 sm:mb-14 ${maxWidth} mx-auto`}
    >
      {children}
    </motion.div>
  );
}

interface StepActionsProps {
  children: ReactNode;
  delay?: number;
}

export function StepActions({ children, delay = 0.4 }: StepActionsProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay }}
    >
      {children}
    </motion.div>
  );
}
