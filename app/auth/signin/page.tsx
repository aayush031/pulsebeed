"use client";

import { signIn } from "next-auth/react";
import { FormEvent, useState } from "react";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    await signIn("credentials", {
      email,
      name,
      callbackUrl: "/",
    });
    setLoading(false);
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md items-center px-6">
      <form
        onSubmit={onSubmit}
        className="w-full rounded-2xl border border-slate-200 bg-white p-6 dark:border-white/10 dark:bg-white/5"
      >
        <h1 className="mb-4 text-xl font-semibold">Sign in to Pulsebeed</h1>
        <label className="mb-3 block text-sm text-slate-700 dark:text-slate-200">
          Name
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder-slate-500 dark:border-white/20 dark:bg-slate-900 dark:text-slate-100 dark:placeholder-slate-400"
            placeholder="Your name"
          />
        </label>
        <label className="mb-4 block text-sm text-slate-700 dark:text-slate-200">
          Email
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            required
            className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 placeholder-slate-500 dark:border-white/20 dark:bg-slate-900 dark:text-slate-100 dark:placeholder-slate-400"
            placeholder="you@example.com"
          />
        </label>
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-cyan-400 px-4 py-2 font-semibold text-slate-950 disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Continue"}
        </button>
      </form>
    </main>
  );
}
