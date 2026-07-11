"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function Preloader() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  if (!isLoading) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
        className="fixed inset-0 z-[100] bg-background flex items-center justify-center"
      >
        {/* Main content container */}
        <div className="flex flex-col items-center">
          {/* Logo icon */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ 
              type: "spring",
              stiffness: 200,
              damping: 15,
              duration: 0.6 
            }}
            className="mb-4"
          >
            <svg
              width="64"
              height="64"
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <defs>
                <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#ec4899" />
                </linearGradient>
              </defs>
              <motion.path
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                d="M8 12C8 10.8954 8.89543 10 10 10H30C31.1046 10 32 10.8954 32 12V32C32 33.1046 31.1046 34 30 34H10C8.89543 34 8 33.1046 8 32V12Z"
                fill="url(#logoGradient)"
              />
              <motion.path
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.4, delay: 0.4 }}
                d="M14 10V8C14 5.79086 15.7909 4 18 4H22C24.2091 4 26 5.79086 26 8V10"
                stroke="url(#logoGradient)"
                strokeWidth="3"
                strokeLinecap="round"
                fill="none"
              />
              <motion.circle
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.7, type: "spring" }}
                cx="28"
                cy="16"
                r="3"
                fill="white"
              />
            </svg>
          </motion.div>

          {/* Logo text */}
          <div className="flex items-center">
            {"SHOPP".split("").map((letter, i) => (
              <motion.span
                key={`shopp-${i}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  delay: 0.5 + i * 0.06,
                  duration: 0.3,
                  ease: "easeOut"
                }}
                className="text-3xl sm:text-4xl font-bold text-foreground"
              >
                {letter}
              </motion.span>
            ))}
            {"DROPP".split("").map((letter, i) => (
              <motion.span
                key={`dropp-${i}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  delay: 0.8 + i * 0.06,
                  duration: 0.3,
                  ease: "easeOut"
                }}
                className="text-3xl sm:text-4xl font-bold text-[#ec4899]"
              >
                {letter}
              </motion.span>
            ))}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
