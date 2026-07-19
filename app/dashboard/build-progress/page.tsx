"use client";

import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import BuildProgressContent from "./BuildProgressContent";

export default function BuildProgressPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a0a0f] via-[#111118] to-[#0a0a0f]">
          <div className="flex items-center gap-3 text-white/50">
            <Loader2 size={24} className="animate-spin text-violet-500" />
            <span>Loading...</span>
          </div>
        </div>
      }
    >
      <BuildProgressContent />
    </Suspense>
  );
}
