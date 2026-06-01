import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { ServiceWorkerRegistrar } from "@/components/layout/ServiceWorkerRegistrar";
import { ThemeProvider } from "@/components/shared/ThemeProvider";
import ToastContainer from "@/components/shared/ToastContainer";
import { TooltipProvider } from "@/components/ui/tooltip";

const boldonse = localFont({
  src: "../fonts/Boldonse/Boldonse-Regular.ttf",
  variable: "--font-boldonse",
});

const castoro = localFont({
  src: "../fonts/Castoro/Castoro-Regular.ttf",
  variable: "--font-castoro",
  weight: "400",
});

const hankenGrotesk = localFont({
  src: "../fonts/Hanken_Grotesk/HankenGrotesk-VariableFont_wght.ttf",
  variable: "--font-hanken-grotesk",
});

export const metadata: Metadata = {
  title: "Inaam - Unlock Your Rewards",
  description: "Inaam helps you unlock rewards by completing a list of associated tasks.",
  manifest: "/manifest.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${boldonse.variable} ${castoro.className} ${hankenGrotesk.className} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col transition-colors duration-300">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
        >
          <TooltipProvider delay={300}>
            <ServiceWorkerRegistrar />
            <ToastContainer />
            {children}
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
