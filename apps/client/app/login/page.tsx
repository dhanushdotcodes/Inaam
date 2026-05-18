import { Metadata } from "next";
import LoginForm from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Sign In | Inaam",
  description: "Sign in to access your rewards dashboard.",
};

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 font-sans p-8 dark:bg-black">
      <LoginForm />
      
      <p className="mt-8 text-zinc-400 text-xs dark:text-zinc-600 select-none">
        Inaam Dashboard • Secure Access
      </p>
    </div>
  );
}
