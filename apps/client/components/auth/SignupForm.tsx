"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, AlertCircle } from "lucide-react";
import { signupUser, loginUser } from "@/lib/api";
import { setToken, isAuthenticated } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormField } from "@/components/ui/form-field";

export default function SignupForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated()) {
      router.push("/tasks");
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedUsername = username.trim();
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    if (!trimmedUsername || !trimmedEmail || !trimmedPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (trimmedUsername.length < 3) {
      setError("Username must be at least 3 characters.");
      return;
    }

    if (trimmedPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // 1. Sign up new user
      await signupUser({
        username: trimmedUsername,
        email: trimmedEmail,
        password: trimmedPassword,
      });

      // 2. Auto-login on success
      const loginResult = await loginUser({
        email: trimmedEmail,
        password: trimmedPassword,
      });

      setToken(loginResult.access_token);
      router.push("/tasks");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Registration failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="w-full max-w-md rounded-3xl bg-white p-10 shadow-xl dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 transition-all">
      <div className="flex items-center gap-4 mb-8">
        <div
          className={`w-3 h-3 rounded-full ${
            loading
              ? "bg-amber-400 animate-pulse"
              : error
                ? "bg-red-500"
                : "bg-primary animate-pulse"
          }`}
        />
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
          Create Account
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <FormField label="Username" required>
          <Input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            disabled={loading}
            placeholder="johndoe"
            autoComplete="username"
            autoFocus
          />
        </FormField>

        <FormField label="Email" required>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            placeholder="name@example.com"
            autoComplete="email"
          />
        </FormField>

        <FormField label="Password" required>
          <div className="relative group">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              placeholder="••••••••"
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              disabled={loading}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-650 dark:text-zinc-600 dark:hover:text-zinc-400 transition-colors disabled:opacity-50"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
        </FormField>

        {error && (
          <div className="bg-destructive/10 text-destructive text-[11px] font-medium px-3 py-1.5 rounded-full w-fit mt-1.5 flex items-center gap-1.5 animate-in fade-in slide-in-from-top-1 duration-200">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>{error}</span>
          </div>
        )}

        <Button
          type="submit"
          isLoading={loading}
          className="w-full h-12 rounded-2xl font-bold transition-opacity"
        >
          Sign Up
        </Button>
      </form>

      <div className="mt-8 text-center text-sm text-zinc-500 dark:text-zinc-400">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-semibold text-primary hover:underline hover:opacity-90 transition-opacity"
        >
          Sign In
        </Link>
      </div>
    </main>
  );
}
