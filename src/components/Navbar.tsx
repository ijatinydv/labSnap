import Link from "next/link";
import { FileText, Github } from "lucide-react";
import {
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { CreditsBadge } from "@/components/CreditsBadge";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 shadow-lg shadow-violet-500/25 transition-all duration-300 group-hover:shadow-violet-500/40">
            <FileText className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
            LabSnap
          </span>
        </Link>

        {/* Center: Navigation Links */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/format"
            className="text-sm font-medium text-zinc-400 transition-colors hover:text-white"
          >
            Smart Formatter
          </Link>
        </nav>

        {/* Right Side: GitHub + Auth */}
        <div className="flex items-center gap-3">
          {/* GitHub Link */}
          <Link
            href="https://github.com/ijatinydv/labSnap"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900/50 px-4 py-2 text-sm font-medium text-zinc-300 transition-all duration-200 hover:border-zinc-700 hover:bg-zinc-800 hover:text-white"
          >
            <Github className="h-4 w-4" />
            <span className="hidden sm:inline">GitHub</span>
          </Link>

          {/* Auth: Sign In Button (when logged out) */}
          <SignedOut>
            <SignInButton mode="modal">
              <button className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-violet-500/25 transition-all duration-200 hover:shadow-violet-500/40 hover:scale-105">
                Sign In
              </button>
            </SignInButton>
          </SignedOut>

          {/* Auth: User section (when logged in) */}
          <SignedIn>
            <CreditsBadge />
            <Link
              href="/dashboard"
              className="flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900/50 px-4 py-2 text-sm font-medium text-zinc-300 transition-all duration-200 hover:border-violet-700 hover:bg-violet-950/50 hover:text-white"
            >
              Dashboard
            </Link>
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox:
                    "h-9 w-9 ring-2 ring-violet-500/50 hover:ring-violet-500 transition-all duration-200",
                },
              }}
            />
          </SignedIn>
        </div>
      </div>
    </header>
  );
}
