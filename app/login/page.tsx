'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient, isSupabaseConfigured } from '../../utils/supabase/client';
import { Sprout, Mail, Lock, ArrowLeft, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const configured = isSupabaseConfigured();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    if (!configured) {
      setStatusMessage({
        type: 'error',
        text: 'Supabase credentials are not yet configured in .env.local. Copy .env.local.example to .env.local and add your NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.',
      });
      return;
    }

    setLoading(true);
    const supabase = createClient();

    try {
      if (mode === 'signin') {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        setStatusMessage({
          type: 'success',
          text: 'Welcome back to your Garden! Redirecting...',
        });
        router.push('/');
        router.refresh();
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              display_name: displayName || email.split('@')[0],
            },
          },
        });
        if (error) throw error;
        setStatusMessage({
          type: 'success',
          text: 'Account created! Check your email to confirm your account, or sign in now.',
        });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Authentication failed.';
      setStatusMessage({
        type: 'error',
        text: msg,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen hybrid-bg flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md journal-card rounded-3xl p-6 sm:p-8">
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-950 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Garden
          </Link>
          <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest bg-[#EDF5EB] border border-[#C6DEC2] text-emerald-800 px-2.5 py-1 rounded-full">
            <Sparkles className="w-3 h-3" /> Cloud Sync
          </span>
        </div>

        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-emerald-800 text-white flex items-center justify-center mx-auto mb-3 shadow-md">
            <Sprout className="w-6 h-6" />
          </div>
          <h1 className="serif text-2xl sm:text-3xl font-bold text-emerald-950">
            {mode === 'signin' ? 'Enter Your Garden' : 'Plant Your Account'}
          </h1>
          <p className="text-xs text-emerald-700 mt-1">
            Sync your cultivated words, botanical rank, and spaced-repetition schedule across devices.
          </p>
        </div>

        {/* Mode Toggle */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-emerald-50 rounded-2xl mb-6 border border-emerald-100">
          <button
            type="button"
            onClick={() => {
              setMode('signin');
              setStatusMessage(null);
            }}
            className={`py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
              mode === 'signin'
                ? 'bg-emerald-800 text-white shadow-sm'
                : 'text-emerald-800 hover:bg-emerald-100/50'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setStatusMessage(null);
            }}
            className={`py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
              mode === 'signup'
                ? 'bg-emerald-800 text-white shadow-sm'
                : 'text-emerald-800 hover:bg-emerald-100/50'
            }`}
          >
            Create Account
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="block text-[11px] font-black uppercase tracking-wider text-emerald-800 mb-1.5">
                Gardener Display Name
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="e.g., Clara the Botanist"
                className="w-full px-4 py-3 rounded-xl border border-emerald-200 focus:border-emerald-600 outline-none text-sm text-emerald-950 font-medium"
              />
            </div>
          )}

          <div>
            <label className="block text-[11px] font-black uppercase tracking-wider text-emerald-800 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-emerald-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-emerald-200 focus:border-emerald-600 outline-none text-sm text-emerald-950 font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-black uppercase tracking-wider text-emerald-800 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-emerald-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-emerald-200 focus:border-emerald-600 outline-none text-sm text-emerald-950 font-medium"
              />
            </div>
          </div>

          {statusMessage && (
            <div
              className={`p-3.5 rounded-xl flex items-start gap-2.5 text-xs font-bold leading-relaxed ${
                statusMessage.type === 'success'
                  ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                  : 'bg-red-50 text-red-900 border border-red-200'
              }`}
            >
              {statusMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              )}
              <span>{statusMessage.text}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-emerald-800 hover:bg-emerald-900 disabled:opacity-60 text-white rounded-2xl font-bold shadow-lg transition-all text-sm"
          >
            {loading
              ? 'Connecting to Garden...'
              : mode === 'signin'
              ? 'Sign In & Sync Garden 🌿'
              : 'Create Gardener Account 🌱'}
          </button>
        </form>

        <div className="mt-6 pt-5 border-t border-emerald-50 text-center">
          <p className="text-[11px] text-emerald-600">
            Playing without an account? Your progress is always saved locally in your browser and will automatically merge when you sign in.
          </p>
        </div>
      </div>
    </div>
  );
}
