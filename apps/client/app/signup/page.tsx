import { Metadata } from "next";
import SignupForm from "@/components/auth/SignupForm";

export const metadata: Metadata = {
  title: "Create Account | Inaam",
  description: "Sign up to start tracking quests and claiming prizes.",
};

export default function SignupPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 font-sans p-8 dark:bg-black">
      <SignupForm />
      
      <p className="mt-8 text-zinc-400 text-xs dark:text-zinc-600 select-none">
        Inaam Dashboard • Registration
      </p>
    </div>
  );
}
