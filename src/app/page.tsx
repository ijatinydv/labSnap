"use client";

import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
  Sparkles,
  LayoutDashboard,
  Cloud,
  Droplets,
  Zap,
  FileText,
  ArrowRight,
  Gift,
  FileDown,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-950">
      <Navbar />

      <main className="flex flex-1 flex-col">
        {/* Hero Section */}
        <section className="relative overflow-hidden px-4 py-24 sm:py-32">
          {/* Background gradient effects */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute left-1/2 top-0 h-[600px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/20 blur-[120px]" />
            <div className="absolute right-0 top-1/2 h-[500px] w-[500px] rounded-full bg-indigo-600/15 blur-[100px]" />
            <div className="absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full bg-purple-600/10 blur-[80px]" />
          </div>

          <div className="relative mx-auto max-w-4xl text-center">
            {/* Logo Badge */}
            <div className="mb-8 inline-flex items-center gap-2.5 rounded-full border border-zinc-800 bg-zinc-900/80 px-4 py-2 backdrop-blur-sm">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600">
                <FileText className="h-4 w-4 text-white" />
              </div>
              <span className="bg-gradient-to-r from-white to-zinc-300 bg-clip-text font-semibold text-transparent">
                LabSnap
              </span>
              <span className="rounded-full bg-emerald-500/20 px-2 py-0.5 text-xs font-medium text-emerald-400">
                Free Trial
              </span>
            </div>

            {/* Hero Headline */}
            <h1 className="mb-6 bg-gradient-to-b from-white via-zinc-100 to-zinc-400 bg-clip-text text-5xl font-bold tracking-tight text-transparent sm:text-6xl lg:text-7xl">
              Lab Records in Seconds.
            </h1>

            {/* Subtext */}
            <p className="mx-auto mb-12 max-w-xl text-lg text-zinc-400 sm:text-xl">
              The AI-powered copilot for Engineering students. Generate perfect
              lab documentation with a single click. Try 2 generations free!
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/generate"
                className="group inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-8 py-4 text-lg font-semibold text-white shadow-lg shadow-violet-600/25 transition-all hover:from-violet-500 hover:to-indigo-500 hover:shadow-xl hover:shadow-violet-600/30"
              >
                <Gift className="h-5 w-5" />
                Try for Free
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>

              <Link
                href="/format"
                className="group inline-flex items-center gap-2 rounded-xl border border-amber-600/50 bg-amber-950/30 px-8 py-4 text-lg font-semibold text-amber-300 backdrop-blur-sm transition-all hover:border-amber-500 hover:bg-amber-900/40 hover:text-amber-200"
              >
                <FileDown className="h-5 w-5" />
                Smart Formatter
                <ArrowRight className="h-5 w-5 opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100" />
              </Link>

              <Link
                href="/dashboard"
                className="group inline-flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900/50 px-8 py-4 text-lg font-semibold text-zinc-300 backdrop-blur-sm transition-all hover:border-zinc-600 hover:bg-zinc-800/50 hover:text-white"
              >
                <LayoutDashboard className="h-5 w-5" />
                Dashboard
                <ArrowRight className="h-5 w-5 opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100" />
              </Link>

            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="relative px-4 pb-20">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-3 text-center text-sm font-medium uppercase tracking-widest text-zinc-500">
              How It Works
            </h2>
            <p className="mb-10 text-center text-lg text-zinc-400">
              Three simple steps to perfect lab documentation
            </p>

            {/* Steps Grid */}
            <div className="grid gap-6 md:grid-cols-3">
              {/* Step 1 */}
              <div className="group relative flex flex-col items-center rounded-2xl border border-zinc-800 bg-zinc-900/30 p-6 text-center transition-all hover:border-violet-600/30 hover:bg-zinc-900/50">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 px-3 py-1 text-sm font-bold text-white">
                  1
                </div>
                <div className="mb-4 mt-2 flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-400 transition-colors group-hover:bg-violet-500/20">
                  <FileText className="h-7 w-7" />
                </div>
                <h3 className="mb-2 font-semibold text-white">Enter Details</h3>
                <p className="text-sm text-zinc-500">
                  Provide your aim, subject, name and roll number
                </p>
              </div>

              {/* Step 2 */}
              <div className="group relative flex flex-col items-center rounded-2xl border border-zinc-800 bg-zinc-900/30 p-6 text-center transition-all hover:border-violet-600/30 hover:bg-zinc-900/50">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 px-3 py-1 text-sm font-bold text-white">
                  2
                </div>
                <div className="mb-4 mt-2 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-400 transition-colors group-hover:bg-indigo-500/20">
                  <Sparkles className="h-7 w-7" />
                </div>
                <h3 className="mb-2 font-semibold text-white">AI Generates</h3>
                <p className="text-sm text-zinc-500">
                  Our AI creates code, output & theory instantly
                </p>
              </div>

              {/* Step 3 */}
              <div className="group relative flex flex-col items-center rounded-2xl border border-zinc-800 bg-zinc-900/30 p-6 text-center transition-all hover:border-violet-600/30 hover:bg-zinc-900/50">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 px-3 py-1 text-sm font-bold text-white">
                  3
                </div>
                <div className="mb-4 mt-2 flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-400 transition-colors group-hover:bg-purple-500/20">
                  <ArrowRight className="h-7 w-7" />
                </div>
                <h3 className="mb-2 font-semibold text-white">Download DOCX</h3>
                <p className="text-sm text-zinc-500">
                  Get a print-ready Word document in seconds
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Action Cards Section */}
        <section className="border-t border-zinc-800/50 px-4 py-16">
          <div className="mx-auto max-w-5xl">
            <div className="grid gap-6 md:grid-cols-3">
              {/* Card 1: Try for Free */}
              <Link href="/generate" className="group">
                <Card className="relative h-full cursor-pointer overflow-hidden border-zinc-800 bg-zinc-900/50 transition-all duration-300 hover:border-violet-600/50 hover:bg-zinc-900/80 hover:shadow-lg hover:shadow-violet-600/10">
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-600/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                  <CardHeader className="relative pb-4">
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 shadow-lg shadow-violet-600/25">
                      <Sparkles className="h-7 w-7 text-white" />
                    </div>
                    <CardTitle className="text-xl text-white transition-colors group-hover:text-violet-300">
                      Try for Free
                    </CardTitle>
                    <CardDescription className="text-base text-zinc-400">
                      Generate 2 lab records without signing up. No credit card required.
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="relative">
                    <div className="flex items-center gap-2 text-sm text-violet-400">
                      <span className="font-medium">Start Generating</span>
                      <span className="transition-transform duration-200 group-hover:translate-x-1">
                        →
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>

              {/* Card 2: DOCX Generator */}
              <Link href="/format" className="group">
                <Card className="relative h-full cursor-pointer overflow-hidden border-zinc-800 bg-zinc-900/50 transition-all duration-300 hover:border-amber-600/50 hover:bg-zinc-900/80 hover:shadow-lg hover:shadow-amber-600/10">
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-amber-600/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                  <CardHeader className="relative pb-4">
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 shadow-lg shadow-amber-600/25">
                      <FileDown className="h-7 w-7 text-white" />
                    </div>
                    <CardTitle className="text-xl text-white transition-colors group-hover:text-amber-300">
                      Smart Formatter
                    </CardTitle>
                    <CardDescription className="text-base text-zinc-400">
                      Have your own code? Paste it here along with screenshots, and we will format it into a perfect Lab Record for you.
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="relative">
                    <div className="flex items-center gap-2 text-sm text-amber-400">
                      <span className="font-medium">Use Smart Formatter</span>
                      <span className="transition-transform duration-200 group-hover:translate-x-1">
                        →
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>

              {/* Card 3: Dashboard */}
              <Link href="/dashboard" className="group">
                <Card className="relative h-full cursor-pointer overflow-hidden border-zinc-800 bg-zinc-900/50 transition-all duration-300 hover:border-emerald-600/50 hover:bg-zinc-900/80 hover:shadow-lg hover:shadow-emerald-600/10">
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-emerald-600/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                  <CardHeader className="relative pb-4">
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 shadow-lg shadow-emerald-600/25">
                      <LayoutDashboard className="h-7 w-7 text-white" />
                    </div>
                    <CardTitle className="text-xl text-white transition-colors group-hover:text-emerald-300">
                      Dashboard
                    </CardTitle>
                    <CardDescription className="text-base text-zinc-400">
                      Sign in to access saved experiments and manage your credits.
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="relative">
                    <div className="flex items-center gap-2 text-sm text-emerald-400">
                      <span className="font-medium">Go to Dashboard</span>
                      <span className="transition-transform duration-200 group-hover:translate-x-1">
                        →
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Grid Section */}
        <section className="border-t border-zinc-800/50 px-4 py-16">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-10 text-center text-2xl font-semibold text-white">
              Built for Speed & Convenience
            </h2>

            <div className="grid gap-6 sm:grid-cols-3">
              {/* Feature 1: Cloud Save */}
              <div className="group flex flex-col items-center rounded-xl border border-zinc-800/50 bg-zinc-900/30 p-6 text-center transition-colors hover:border-zinc-700 hover:bg-zinc-900/50">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 transition-colors group-hover:bg-blue-500/20">
                  <Cloud className="h-6 w-6" />
                </div>
                <h3 className="mb-2 font-semibold text-white">Cloud Save</h3>
                <p className="text-sm text-zinc-500">
                  Your experiments are saved to your dashboard for easy access.
                </p>
              </div>

              {/* Feature 2: Ink Saver */}
              <div className="group flex flex-col items-center rounded-xl border border-zinc-800/50 bg-zinc-900/30 p-6 text-center transition-colors hover:border-zinc-700 hover:bg-zinc-900/50">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 transition-colors group-hover:bg-emerald-500/20">
                  <Droplets className="h-6 w-6" />
                </div>
                <h3 className="mb-2 font-semibold text-white">Ink Saver</h3>
                <p className="text-sm text-zinc-500">
                  Optimized output formatting to save printer ink.
                </p>
              </div>

              {/* Feature 3: Instant Generation */}
              <div className="group flex flex-col items-center rounded-xl border border-zinc-800/50 bg-zinc-900/30 p-6 text-center transition-colors hover:border-zinc-700 hover:bg-zinc-900/50">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400 transition-colors group-hover:bg-amber-500/20">
                  <Zap className="h-6 w-6" />
                </div>
                <h3 className="mb-2 font-semibold text-white">
                  Instant Generation
                </h3>
                <p className="text-sm text-zinc-500">
                  Get your complete lab record in under 30 seconds.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
