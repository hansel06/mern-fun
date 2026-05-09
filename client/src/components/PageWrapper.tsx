import { motion } from 'framer-motion';
import type { Transition } from 'framer-motion';
import type { ReactNode } from 'react';

interface PageWrapperProps {
  children: ReactNode;
  className?: string;
}

const pageVariants = {
  initial: {
    opacity: 0,
    y: 15,
    scale: 0.98,
  },
  in: {
    opacity: 1,
    y: 0,
    scale: 1,
  },
  out: {
    opacity: 0,
    y: -15,
    scale: 1.02,
  },
};

const pageTransition: Transition = {
  type: 'tween',
  ease: [0.22, 1, 0.36, 1], // Custom apple-like easing
  duration: 0.6,
};

const PageWrapper = ({ children, className = '' }: PageWrapperProps) => {
  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      className={`w-full h-full ${className}`}
    >
      {children}
    </motion.div>
  );
};

export default PageWrapper;
