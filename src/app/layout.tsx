import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { LocaleProvider } from "@/lib/use-locale";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Between Clouds — Think. Process. Let Go.",
  description:
    "An ephemeral mental health companion on WhatsApp. Your conversations disappear after processing. No data stored. No algorithms. Just a safe space to think.",
  keywords: [
    "mental health",
    "ephemeral messaging",
    "WhatsApp",
    "AI companion",
    "privacy",
    "safe space",
    "Between Clouds",
  ],
  icons: {
    icon: "/favicon.png",
  },
  openGraph: {
    title: "Between Clouds — Think. Process. Let Go.",
    description:
      "An ephemeral mental health companion on WhatsApp. No data stored. No algorithms. Just a safe space to think.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Between Clouds — Think. Process. Let Go.",
    description:
      "An ephemeral mental health companion on WhatsApp. Your conversations disappear after processing.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={`${inter.variable} antialiased bg-background text-foreground`}
      >
        <LocaleProvider>
          {children}
          <Toaster />
        </LocaleProvider>
      </body>
    </html>
  );
}
