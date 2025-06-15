"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  animate?: boolean;
}

export default function Card({
  children,
  className = "",
  animate = true,
}: CardProps) {
  const cardContent = (
    <div
      className={`
        bg-white dark:bg-gray-800
        rounded-2xl shadow-xl
        p-6
        ${className}
      `}
    >
      {children}
    </div>
  );

  if (animate) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {cardContent}
      </motion.div>
    );
  }

  return cardContent;
}
