"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { Zap } from "lucide-react";

export function CreditsBadge() {
  const { isSignedIn } = useAuth();
  const [credits, setCredits] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isSignedIn) {
      setLoading(false);
      return;
    }

    const fetchCredits = async () => {
      try {
        const response = await fetch("/api/user/credits");
        const data = await response.json();
        setCredits(data.credits);
      } catch {
        setCredits(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCredits();
  }, [isSignedIn]);

  // Don't show if not signed in or no credits data
  if (!isSignedIn || credits === null) {
    return null;
  }

  if (loading) {
    return (
      <div className="flex items-center gap-1.5 rounded-full bg-zinc-800 px-3 py-1.5 text-sm">
        <div className="h-3.5 w-3.5 animate-pulse rounded-full bg-zinc-700" />
        <div className="h-4 w-8 animate-pulse rounded bg-zinc-700" />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5 rounded-full bg-zinc-800 px-3 py-1.5 text-sm font-medium text-zinc-200">
      <Zap className="h-3.5 w-3.5 text-amber-400" />
      <span>{credits}</span>
      <span className="text-zinc-400">Credits</span>
    </div>
  );
}
