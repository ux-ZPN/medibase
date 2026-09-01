import { Activity, ShieldCheck, Database, Layers, CheckCircle2, AlertCircle } from "lucide-react";
import { isSupabaseConfigured } from "@/lib/supabase/client";

export default function Home() {
  const isConnected = isSupabaseConfigured();

  return (
    <main className="flex-1 flex flex-col items-center justify-center p-6 md:p-12">
      <div className="w-full max-w-3xl text-center space-y-8">
        {/* Brand Header */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-sky-200 dark:border-sky-900 bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300 text-xs font-semibold uppercase tracking-wider">
          <Activity className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
          Foundation & Supabase Client Initialized
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Medi<span className="text-sky-600 dark:text-sky-400">Base</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            A secure healthcare record-sharing platform that enables authorized
            healthcare providers to access and contribute to a patient&apos;s
            longitudinal medical history.
          </p>
        </div>

        {/* Foundation Status Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-left">
          <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm shadow-xs space-y-2">
            <div className="w-8 h-8 rounded-lg bg-sky-100 dark:bg-sky-950 flex items-center justify-center text-sky-600 dark:text-sky-400">
              <Layers className="w-4 h-4" />
            </div>
            <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100">
              Next.js & TypeScript
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              App Router structure and strict type checking active.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm shadow-xs space-y-2">
            <div className="w-8 h-8 rounded-lg bg-teal-100 dark:bg-teal-950 flex items-center justify-center text-teal-600 dark:text-teal-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100">
              Tailwind CSS
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Theme tokens and modern styling baseline configured.
            </p>
          </div>

          <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm shadow-xs space-y-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <Database className="w-4 h-4" />
            </div>
            <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100">
              Supabase Integration
            </h3>
            <div className="flex items-center gap-1.5 text-xs">
              {isConnected ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                    Keys Configured
                  </span>
                </>
              ) : (
                <>
                  <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                  <span className="text-amber-600 dark:text-amber-400">
                    Awaiting .env.local keys
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Status Notice */}
        <div className="pt-6 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 flex items-center justify-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Local Development Environment Active</span>
        </div>
      </div>
    </main>
  );
}
