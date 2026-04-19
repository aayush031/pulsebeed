"use client";

import Link from "next/link";
import { useTheme } from "next-themes";
import { signIn, signOut, useSession } from "next-auth/react";

export function Topbar() {
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 text-slate-900 backdrop-blur dark:border-white/10 dark:bg-slate-950/90 dark:text-slate-100">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3 md:px-6">
        <Link href="/" className="text-lg font-bold text-cyan-700 dark:text-cyan-300">
          pulsebeed
        </Link>
        <div className="flex items-center gap-2">
          <Link
            href="/admin"
            className="rounded-md px-3 py-1 text-sm hover:bg-slate-200 dark:hover:bg-white/10"
          >
            Admin
          </Link>
          <Link
            href="/continue"
            className="rounded-md px-3 py-1 text-sm hover:bg-slate-200 dark:hover:bg-white/10"
          >
            Continue
          </Link>
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="rounded-md px-3 py-1 text-sm hover:bg-slate-200 dark:hover:bg-white/10"
          >
            Theme
          </button>
          {session?.user ? (
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="rounded-md bg-slate-200 px-3 py-1 text-sm hover:bg-slate-300 dark:bg-white/10 dark:hover:bg-white/20"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={() => signIn()}
              className="rounded-md bg-cyan-400 px-3 py-1 text-sm font-semibold text-slate-950"
            >
              Sign In
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
