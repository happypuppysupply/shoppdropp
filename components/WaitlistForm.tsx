"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Check, Loader2 } from "lucide-react";

// Client-side storage for signups
const STORAGE_KEY = "shoppdropp_signups";

interface SignupEntry {
  email: string;
  storeUrl: string;
  timestamp: string;
}

function getSignups(): SignupEntry[] {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}

function addSignup(entry: SignupEntry): void {
  const current = getSignups();
  current.push(entry);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
}

function isEmailRegistered(email: string): boolean {
  return getSignups().some((entry) => entry.email === email);
}

export function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [storeUrl, setStoreUrl] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    if (isEmailRegistered(email)) {
      setStatus("error");
      setMessage("This email is already registered!");
      return;
    }

    addSignup({
      email,
      storeUrl: storeUrl || "",
      timestamp: new Date().toISOString(),
    });

    setStatus("success");
    setMessage("Welcome! We'll reach out soon.");
    setEmail("");
    setStoreUrl("");
  };

  if (status === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="p-6 rounded-2xl bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 text-center"
      >
        <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
          <Check className="w-6 h-6 text-green-600 dark:text-green-400" />
        </div>
        <h3 className="text-xl font-semibold text-foreground mb-2">Welcome!</h3>
        <p className="text-muted-foreground">{message}</p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="flex-1 px-4 py-3 rounded-xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-all"
        />
        <input
          type="url"
          placeholder="Your Shopify store (optional)"
          value={storeUrl}
          onChange={(e) => setStoreUrl(e.target.value)}
          className="flex-1 px-4 py-3 rounded-xl bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500 transition-all"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-pink-500 text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2 whitespace-nowrap"
        >
          {status === "loading" ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              Sign Up <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
      {status === "error" && (
        <p className="text-red-500 text-sm">{message}</p>
      )}
      <p className="text-xs text-muted-foreground text-center">
        No spam, ever. Unsubscribe anytime.
      </p>
    </form>
  );
}
