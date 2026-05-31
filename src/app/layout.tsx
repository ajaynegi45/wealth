import type { Metadata } from "next";
import { Inter, Outfit, Geist } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Wealth Management",
  description: "Track your financial legacy",
};

export const viewport = {
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body
        className={`${inter.variable} ${outfit.variable} antialiased bg-card text-foreground min-h-screen flex flex-col font-sans`}
      >
        <div className="flex-1 bg-background flex flex-col min-h-screen">
          {children}
        </div>
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  );
}
