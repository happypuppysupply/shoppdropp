"use client";

import { motion } from "framer-motion";

interface LogoProps {
  className?: string;
  size?: number;
}

export function ShoppDroppLogo({ className = "", size = 40 }: LogoProps) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      whileHover={{ scale: 1.05 }}
    >
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#ec4899" />
        </linearGradient>
      </defs>
      {/* Shopping bag shape */}
      <path
        d="M8 12C8 10.8954 8.89543 10 10 10H30C31.1046 10 32 10.8954 32 12V32C32 33.1046 31.1046 34 30 34H10C8.89543 34 8 33.1046 8 32V12Z"
        fill="url(#logoGradient)"
      />
      {/* Bag handle */}
      <path
        d="M14 10V8C14 5.79086 15.7909 4 18 4H22C24.2091 4 26 5.79086 26 8V10"
        stroke="url(#logoGradient)"
        strokeWidth="3"
        strokeLinecap="round"
      />
      {/* AI/tech indicator dot */}
      <circle cx="28" cy="16" r="3" fill="white" />
    </motion.svg>
  );
}

export function ShoppDroppText({ className = "" }: { className?: string }) {
  return (
    <span className={`font-bold text-xl tracking-tight ${className}`}>
      <span className="text-white">SHOPP</span>
      <span className="text-[#ec4899]">DROPP</span>
    </span>
  );
}

export function ShoppDroppTextLight({ className = "" }: { className?: string }) {
  return (
    <span className={`font-bold text-xl tracking-tight ${className}`}>
      <span className="text-slate-900">SHOPP</span>
      <span className="text-[#ec4899]">DROPP</span>
    </span>
  );
}
