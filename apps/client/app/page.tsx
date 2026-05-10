import { Metadata } from "next";
import VerifyAccessForm from "@/components/auth/VerifyAccessForm";

export const metadata: Metadata = {
  title: "Verify Access | Inaam",
  description: "Securely access your rewards dashboard.",
};

/**
 * Home page — Secret key verification gate.
 * Composes the verification form and layout.
 */
export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 font-sans p-8 dark:bg-black">
      <VerifyAccessForm />
      
      <p className="mt-8 text-zinc-400 text-xs dark:text-zinc-600">
        Inaam Dashboard • Access Verification
      </p>
    </div>
  );
}
