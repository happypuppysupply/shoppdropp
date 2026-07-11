"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Lock, User, Eye, EyeOff, Loader2, Sparkles } from "lucide-react";
import { useAuth } from "../hooks/useAuth";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: "signin" | "signup" | "magic";
}

export function AuthModal({ isOpen, onClose, defaultMode = "signin" }: AuthModalProps) {
  const [mode, setMode] = useState<"signin" | "signup" | "magic">(defaultMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [magicLinkSent, setMagicLinkSent] = useState(false);

  const { signInWithEmail, signUpWithEmail, signInWithMagicLink } = useAuth();

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setError(null);
    setShowPassword(false);
    setMagicLinkSent(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSwitchMode = (newMode: "signin" | "signup" | "magic") => {
    setMode(newMode);
    resetForm();
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (mode === "signin") {
        const { error } = await signInWithEmail(email, password);
        if (error) {
          setError(error.message);
        } else {
          handleClose();
          window.location.href = "/dashboard";
        }
      } else if (mode === "signup") {
        const { error } = await signUpWithEmail(email, password);
        if (error) {
          setError(error.message);
        } else {
          setError("Check your email for a confirmation link!");
        }
      } else if (mode === "magic") {
        const { error } = await signInWithMagicLink(email);
        if (error) {
          setError(error.message);
        } else {
          setMagicLinkSent(true);
        }
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Show magic link success state
  if (magicLinkSent) {
    return (
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={handleClose}
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-[#111118] shadow-2xl p-8 text-center"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 via-pink-500 to-blue-500" />
              <div className="mb-6 flex justify-center">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center">
                  <Mail size={32} className="text-emerald-400" />
                </div>
              </div>
              <h2 className="text-2xl font-bold gradient-text mb-4">Check Your Email</h2>
              <p className="text-white/70 mb-6">
                We sent a magic link to <span className="text-white font-medium">{email}</span>. Click the link to sign in instantly.
              </p>
              <button
                onClick={handleClose}
                className="w-full rounded-xl bg-white/10 py-3 text-sm font-medium text-white hover:bg-white/20 transition-colors"
              >
                Got it
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={handleClose}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-[#111118] shadow-2xl"
          >
            {/* Gradient top border */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-500 via-pink-500 to-blue-500" />

            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 z-10 rounded-full p-2 text-white/50 transition-colors hover:bg-white/10 hover:text-white"
            >
              <X size={20} />
            </button>

            {/* Content */}
            <div className="p-8">
              {/* Header */}
              <div className="mb-8 text-center">
                <h2 className="text-2xl font-bold">
                  <span className="gradient-text">
                    {mode === "signin" && "Welcome Back"}
                    {mode === "signup" && "Create Account"}
                    {mode === "magic" && "Magic Link Login"}
                  </span>
                </h2>
                <p className="mt-2 text-sm text-white/50">
                  {mode === "signin" && "Sign in to access your AI-powered store"}
                  {mode === "signup" && "Get started with ShoppDropp today"}
                  {mode === "magic" && "No password needed. We'll email you a link."}
                </p>
              </div>

              {/* Tab Switcher */}
              <div className="mb-6 flex rounded-xl bg-white/5 p-1">
                <button
                  onClick={() => handleSwitchMode("signin")}
                  className={`flex-1 rounded-lg py-2.5 text-sm font-medium transition-all ${
                    mode === "signin"
                      ? "bg-gradient-to-r from-violet-600 to-pink-600 text-white shadow-lg"
                      : "text-white/50 hover:text-white"
                  }`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => handleSwitchMode("signup")}
                  className={`flex-1 rounded-lg py-2.5 text-sm font-medium transition-all ${
                    mode === "signup"
                      ? "bg-gradient-to-r from-violet-600 to-pink-600 text-white shadow-lg"
                      : "text-white/50 hover:text-white"
                  }`}
                >
                  Sign Up
                </button>
                <button
                  onClick={() => handleSwitchMode("magic")}
                  className={`flex-1 rounded-lg py-2.5 text-sm font-medium transition-all flex items-center justify-center gap-1 ${
                    mode === "magic"
                      ? "bg-gradient-to-r from-violet-600 to-pink-600 text-white shadow-lg"
                      : "text-white/50 hover:text-white"
                  }`}
                >
                  <Sparkles size={14} />
                  Magic
                </button>
              </div>

              {/* Email Form */}
              <form onSubmit={handleEmailSubmit} className="space-y-4">
                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30"
                  />
                  <input
                    type="email"
                    placeholder="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-10 pr-4 text-sm text-white placeholder-white/30 outline-none transition-all focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20"
                  />
                </div>

                {mode !== "magic" && (
                  <div className="relative">
                    <Lock
                      size={18}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30"
                    />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                      className="w-full rounded-xl border border-white/10 bg-white/5 py-3 pl-10 pr-10 text-sm text-white placeholder-white/30 outline-none transition-all focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 transition-colors hover:text-white/60"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                )}

                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`text-center text-sm ${
                      error.includes("Check your email")
                        ? "text-emerald-400"
                        : "text-red-400"
                    }`}
                  >
                    {error}
                  </motion.p>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-violet-600 via-pink-600 to-violet-600 bg-[length:200%_100%] py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/25 transition-all hover:shadow-violet-500/40 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {isLoading ? (
                      <Loader2 size={18} className="animate-spin" />
                    ) : mode === "magic" ? (
                      <>
                        <Sparkles size={18} />
                        Send Magic Link
                      </>
                    ) : mode === "signin" ? (
                      <>
                        <User size={18} />
                        Sign In
                      </>
                    ) : (
                      <>
                        <User size={18} />
                        Create Account
                      </>
                    )}
                  </span>
                </button>
              </form>

              {/* Footer */}
              <p className="mt-6 text-center text-xs text-white/30">
                By continuing, you agree to our{" "}
                <a href="#" className="text-violet-400 hover:text-violet-300">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-violet-400 hover:text-violet-300">
                  Privacy Policy
                </a>
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}