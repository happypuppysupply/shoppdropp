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
      <rect width="40" height="40" rx="10" fill="url(#logoGradient)" />
      <path
        d="M12 14h16M12 20h12M12 26h8"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <circle cx="28" cy="26" r="4" fill="white" />
    </motion.svg>
  );
}

export function ShoppDroppText({ className = "" }: { className?: string }) {
  return (
    <span className={`font-bold text-xl ${className}`}>
      <span className="text-white">Shopp</span>
      <span className="text-[#ec4899]">Dropp</span>
    </span>
  );
}
