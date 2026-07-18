"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Lock, User, Eye, EyeOff, Loader2, Sparkles } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

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
  const [magicSent, setMagicSent] = useState(false);

  const { signInWithEmail, signUpWithEmail, signInWithMagicLink, signInWithGoogle } = useAuth();

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setError(null);
    setShowPassword(false);
    setMagicSent(false);
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
          window.location.href = "/app";
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
          setMagicSent(true);
        }
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError(null);
    try {
      await signInWithGoogle();
      // Google OAuth will redirect, so we don't need to handle success here
    } catch (err) {
      setError("Google sign-in failed. Please try again.");
      setIsLoading(false);
    }
  };

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
                    {mode === "signin" ? "Welcome Back" : mode === "signup" ? "Create Account" : "Magic Sign In"}
                  </span>
                </h2>
                <p className="mt-2 text-sm text-white/50">
                  {mode === "signin"
                    ? "Sign in to access your AI-powered store"
                    : mode === "signup"
                    ? "Get started with ShoppDropp today"
                    : "We'll send you a magic link to sign in instantly"}
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
                  className={`flex-1 rounded-lg py-2.5 text-sm font-medium transition-all ${
                    mode === "magic"
                      ? "bg-gradient-to-r from-violet-600 to-pink-600 text-white shadow-lg"
                      : "text-white/50 hover:text-white"
                  }`}
                >
                  Magic
                </button>
              </div>

              {/* Magic Link Success State */}
              {magicSent ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-6 text-center"
                >
                  <Sparkles className="mx-auto mb-3 h-8 w-8 text-emerald-400" />
                  <h3 className="text-lg font-semibold text-emerald-400 mb-2">Magic Link Sent!</h3>
                  <p className="text-sm text-white/60">
                    Check your email at <span className="text-white font-medium">{email}</span> for a magic sign-in link.
                  </p>
                  <button
                    onClick={() => setMagicSent(false)}
                    className="mt-4 text-sm text-violet-400 hover:text-violet-300 underline"
                  >
                    Try another email
                  </button>
                </motion.div>
              ) : (
                <>
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
                          error.includes("Check your email") || error.includes("confirmation")
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
                        ) : mode === "signin" ? (
                          <>
                            <User size={18} />
                            Sign In
                          </>
                        ) : mode === "signup" ? (
                          <>
                            <User size={18} />
                            Create Account
                          </>
                        ) : (
                          <>
                            <Sparkles size={18} />
                            Send Magic Link
                          </>
                        )}
                      </span>
                    </button>
                  </form>

                  {/* Divider */}
                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-white/10" />
                    </div>
                    <div className="relative flex justify-center text-xs">
                      <span className="bg-[#111118] px-3 text-white/30 uppercase tracking-wider">or</span>
                    </div>
                  </div>

                  {/* Google Sign In */}
                  <button
                    onClick={handleGoogleSignIn}
                    disabled={isLoading}
                    className="relative w-full flex items-center justify-center gap-3 rounded-xl border border-white/10 bg-white py-3 text-sm font-medium text-gray-900 transition-all hover:bg-gray-50 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                  >
                    <svg className="h-5 w-5" viewBox="0 0 24 24">
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                      />
                    </svg>
                    Continue with Google
                  </button>
                </>
              )}

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
