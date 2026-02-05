import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { DashboardList } from "@/components/DashboardList";
import { FlaskConical, Sparkles } from "lucide-react";

export default async function DashboardPage() {
  // 1. Authentication: Check if user is logged in
  const { userId } = await auth();

  if (!userId) {
    redirect("/");
  }

  // 2. Get user from database
  const user = await db.user.findUnique({
    where: { clerkId: userId },
    select: { id: true, credits: true },
  });

  // If user doesn't exist in our DB yet, redirect to home
  // They need to save at least one experiment first
  if (!user) {
    redirect("/");
  }

  // 3. Fetch all experiments for this user
  const experiments = await db.experiment.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="flex min-h-screen flex-col bg-zinc-950">
      <Navbar />

      <main className="flex-1 px-4 py-12">
        <div className="container mx-auto max-w-6xl">
          {/* Header */}
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="flex items-center gap-3 text-3xl font-bold text-white">
                <FlaskConical className="h-8 w-8 text-violet-500" />
                My Experiments
              </h1>
              <p className="mt-1 text-zinc-400">
                {experiments.length} experiment{experiments.length !== 1 ? "s" : ""} saved
              </p>
            </div>

            {/* Credits Badge */}
            <div className="flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-950 to-indigo-950 px-4 py-2 ring-1 ring-violet-800/50">
              <Sparkles className="h-4 w-4 text-violet-400" />
              <span className="font-medium text-white">{user.credits}</span>
              <span className="text-zinc-400">credits remaining</span>
            </div>
          </div>

          {/* Experiments Grid */}
          <DashboardList experiments={experiments} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
