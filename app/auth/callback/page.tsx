"use client";

import { useEffect, useState, Suspense, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a0a0f] via-[#111118] to-[#0a0a0f]">
        <div className="flex items-center gap-3 text-white/50">
          <Loader2 size={24} className="animate-spin" />
          <span>Loading...</span>
        </div>
      </div>
    }>
      <AuthCallbackContent />
    </Suspense>
  );
}

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Verifying your email...");
  const supabaseRef = useRef<SupabaseClient | null>(null);

  useEffect(() => {
    // Initialize Supabase client in browser only
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!url || !key) {
      setStatus("error");
      setMessage("Configuration error: Missing Supabase credentials");
      setTimeout(() => router.push("/"), 3000);
      return;
    }
    
    supabaseRef.current = createBrowserClient(url, key);

    const handleAuthCallback = async () => {
      if (!supabaseRef.current) return;
      
      // Check for error in URL
      const error = searchParams.get("error");
      const errorDescription = searchParams.get("error_description");
      
      if (error) {
        setStatus("error");
        setMessage(errorDescription || "Authentication failed");
        setTimeout(() => router.push("/"), 3000);
        return;
      }

      // Check for confirmation token (email confirmation)
      const token = searchParams.get("token");
      const type = searchParams.get("type");
      
      if (token && type === "signup") {
        try {
          // Exchange the token for a session
          const { error: verifyError } = await supabaseRef.current.auth.verifyOtp({
            token_hash: token,
            type: "signup",
          });
          
          if (verifyError) {
            setStatus("error");
            setMessage(verifyError.message);
            setTimeout(() => router.push("/"), 3000);
            return;
          }
          
          setStatus("success");
          setMessage("Email confirmed! Redirecting to dashboard...");
          setTimeout(() => router.push("/dashboard"), 1500);
          return;
        } catch (err) {
          setStatus("error");
          setMessage("Failed to verify email");
          setTimeout(() => router.push("/"), 3000);
          return;
        }
      }

      // Check for auth code (OAuth or magic link)
      const code = searchParams.get("code");
      
      if (code) {
        try {
          const { error: sessionError } = await supabaseRef.current.auth.exchangeCodeForSession(code);
          
          if (sessionError) {
            setStatus("error");
            setMessage(sessionError.message);
            setTimeout(() => router.push("/"), 3000);
            return;
          }
          
          setStatus("success");
          setMessage("Signed in! Redirecting to dashboard...");
          setTimeout(() => router.push("/dashboard"), 1500);
          return;
        } catch (err) {
          setStatus("error");
          setMessage("Failed to complete sign in");
          setTimeout(() => router.push("/"), 3000);
          return;
        }
      }

      // If no token or code, just check if user is already logged in
      const { data: { user } } = await supabaseRef.current.auth.getUser();
      
      if (user) {
        setStatus("success");
        setMessage("Already signed in! Redirecting...");
        setTimeout(() => router.push("/dashboard"), 1000);
      } else {
        // No auth data, redirect home
        router.push("/");
      }
    };

    handleAuthCallback();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0a0a0f] via-[#111118] to-[#0a0a0f] p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass rounded-2xl p-8 text-center max-w-md w-full border border-white/10"
      >
        {status === "loading" && (
          <>
            <div className="flex justify-center mb-4">
              <Loader2 size={48} className="animate-spin text-violet-400" />
            </div>
            <h2 className="text-xl font-semibold mb-2">{message}</h2>
            <p className="text-white/50 text-sm">Please wait...</p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="flex justify-center mb-4">
              <CheckCircle2 size={48} className="text-emerald-400" />
            </div>
            <h2 className="text-xl font-semibold mb-2 text-emerald-400">Success!</h2>
            <p className="text-white/70">{message}</p>
          </>
        )}

        {status === "error" && (
          <>
            <div className="flex justify-center mb-4">
              <XCircle size={48} className="text-red-400" />
            </div>
            <h2 className="text-xl font-semibold mb-2 text-red-400">Error</h2>
            <p className="text-white/70">{message}</p>
            <p className="text-white/50 text-sm mt-4">Redirecting you back...</p>
          </>
        )}
      </motion.div>
    </div>
  );
}
