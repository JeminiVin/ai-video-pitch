'use client';

import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Zap, Mail, Lock, ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        alert('Account created successfully! You can now log in.');
        setIsSignUp(false);
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        router.push('/pitch/dashboard');
      }
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F7FF] text-slate-800 font-sans flex flex-col justify-between">
      
      {/* Top Header */}
      <nav className="bg-[#0052FF] py-4 px-6 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-white text-[#0052FF] flex items-center justify-center font-black shadow-md">
              <Zap className="h-5 w-5 fill-[#0052FF]" />
            </div>
            <span className="font-black text-2xl tracking-tight text-white">
              Pitch<span className="text-yellow-300">Pulse</span>
            </span>
          </Link>
        </div>
      </nav>

      {/* Main Login Form Box */}
      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="bg-white border border-slate-200/80 rounded-3xl p-8 sm:p-10 max-w-md w-full shadow-2xl space-y-6">
          
          <div className="text-center space-y-2">
            <div className="h-12 w-12 rounded-2xl bg-blue-50 text-[#0052FF] flex items-center justify-center mx-auto border border-blue-100">
              <Sparkles className="h-6 w-6" />
            </div>
            <h1 className="text-2xl font-black text-slate-900">
              {isSignUp ? 'Create Your Account' : 'Welcome Back'}
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              {isSignUp
                ? 'Sign up to start generating high-converting pitch links.'
                : 'Enter your credentials to access your proposal dashboard.'}
            </p>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Email Address</label>
              <div className="relative">
                <Mail className="h-4 w-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-xs text-slate-900 focus:outline-none focus:border-[#0052FF] transition-all font-medium"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">Password</label>
              <div className="relative">
                <Lock className="h-4 w-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-3 text-xs text-slate-900 focus:outline-none focus:border-[#0052FF] transition-all font-medium"
                />
              </div>
            </div>

            {errorMsg && (
              <p className="text-xs text-red-500 font-bold text-center bg-red-50 py-2 rounded-lg border border-red-100">
                {errorMsg}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-[#0052FF] hover:bg-blue-700 disabled:opacity-50 text-white font-extrabold rounded-2xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 transition-all cursor-pointer"
            >
              <span>{loading ? 'Processing...' : isSignUp ? 'Sign Up' : 'Sign In'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <div className="text-center border-t border-slate-100 pt-4">
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setErrorMsg('');
              }}
              className="text-xs text-[#0052FF] font-bold hover:underline"
            >
              {isSignUp
                ? 'Already have an account? Sign In'
                : "Don't have an account? Create one"}
            </button>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-500 font-medium">
        PitchPulse Engine © 2026 — Secure Supabase Authentication
      </footer>

    </div>
  );
}