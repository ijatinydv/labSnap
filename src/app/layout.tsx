import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LabSnap | Generate Lab Records Instantly",
  description:
    "An automated tool for engineering students to generate print-ready lab record Word documents that match their college's format.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: "#7c3aed",
          colorBackground: "#18181b",
          colorText: "#fafafa",
          colorInputBackground: "#27272a",
          colorInputText: "#fafafa",
        },
        elements: {
          formButtonPrimary:
            "bg-violet-600 hover:bg-violet-700 text-white",
          card: "bg-zinc-900 border border-zinc-800",
          headerTitle: "text-white",
          headerSubtitle: "text-zinc-400",
          socialButtonsBlockButton:
            "bg-zinc-800 border-zinc-700 text-white hover:bg-zinc-700",
          formFieldLabel: "text-zinc-300",
          formFieldInput: "bg-zinc-800 border-zinc-700 text-white",
          footerActionLink: "text-violet-400 hover:text-violet-300",
        },
      }}
    >
      <html lang="en" className="dark">
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
