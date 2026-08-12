'use client';

import Link from 'next/link';
import { AlertCircle, ArrowLeft } from 'lucide-react';

export default function AuthCodeErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-900 via-purple-900 to-pink-900">
      <div className="w-full max-w-md p-8 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20">
        <div className="flex flex-col items-center text-center">
          <div className="p-3 bg-red-500/20 rounded-full mb-4">
            <AlertCircle className="w-8 h-8 text-red-400" />
          </div>
          
          <h1 className="text-2xl font-bold text-white mb-2">
            Authentication Error
          </h1>
          
          <p className="text-white/70 mb-6">
            There was a problem signing you in. The authentication code was missing or expired. 
            This can happen if the sign-in process was interrupted or took too long.
          </p>
          
          <div className="space-y-3 w-full">
            <Link
              href="/login"
              className="w-full py-3 bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-500 hover:to-pink-500 text-white font-semibold rounded-lg transition-all flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Try Again
            </Link>
            
            <Link
              href="/"
              className="block w-full py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg transition-all"
            >
              Go Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}