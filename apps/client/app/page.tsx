"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { verifyKey } from "@/lib/api";
import { setToken, isAuthenticated } from "@/lib/auth";

/**
 * Home page — Secret key verification gate.
 * Accepts a key, verifies it against the backend auth endpoint,
 * and displays the result (success with JWT or error).
 */
export default function Home() {
  const router = useRouter();
  const [key, setKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [showKey, setShowKey] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated()) {
      router.push("/rewards");
    }
  }, [router]);

  /**
   * Handle form submission to verify the secret key.
   */
  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedKey = key.trim();
    if (!trimmedKey) {
      setError("Please enter a key.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const result = await verifyKey(trimmedKey);
      setToken(result.access_token);
      router.push("/rewards");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Verification failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 font-sans p-8 dark:bg-black">
      <main className="w-full max-w-md rounded-3xl bg-white p-10 shadow-xl dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 transition-all">
        <div className="flex items-center gap-4 mb-8">
          <div
            className={`w-3 h-3 rounded-full ${
              loading
                ? "bg-amber-400 animate-pulse"
                : error
                  ? "bg-red-500"
                  : "bg-zinc-300 dark:bg-zinc-700"
            }`}
          />
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Verify Access
          </h1>
        </div>

        <form onSubmit={handleVerify} className="space-y-6">
          <div className="space-y-2">
            <label
              htmlFor="secret-key"
              className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
            >
              Secret Key
            </label>
            <div className="relative group">
              <input
                id="secret-key"
                type={showKey ? "text" : "password"}
                value={key}
                onChange={(e) => setKey(e.target.value)}
                disabled={loading}
                placeholder="Enter your secret key"
                autoFocus
                className="w-full rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 px-4 py-3 pr-12 text-sm text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 transition-all disabled:opacity-50"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                disabled={loading}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:text-zinc-600 dark:hover:text-zinc-400 transition-colors disabled:opacity-50"
              >
                {showKey ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="p-4 text-sm font-medium text-red-800 bg-red-50 rounded-2xl border border-red-100 dark:bg-red-900/20 dark:text-red-400 dark:border-red-900/30">
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 shrink-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>{error}</span>
              </div>
            </div>
          )}


          <button
            id="verify-button"
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-2xl font-bold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {loading && (
              <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white dark:border-zinc-900/30 dark:border-t-zinc-900 animate-spin" />
            )}
            {loading ? "Verifying..." : "Verify Key"}
          </button>
        </form>
      </main>

      <p className="mt-8 text-zinc-400 text-xs dark:text-zinc-600">
        Inaam Dashboard • Access Verification
      </p>
    </div>
  );
}
