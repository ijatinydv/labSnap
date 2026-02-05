"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Copy, Check, Code2, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Experiment {
  id: string;
  aim: string;
  subject: string;
  code: string;
  output: string;
  theory: string | null;
  syntax: string | null;
  createdAt: Date;
}

interface DashboardListProps {
  experiments: Experiment[];
}

export function DashboardList({ experiments }: DashboardListProps) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Handle delete experiment
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this experiment?")) return;

    setDeletingId(id);

    try {
      const response = await fetch("/api/experiments/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete");
      }

      // Refresh the page to show updated list
      router.refresh();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to delete experiment");
    } finally {
      setDeletingId(null);
    }
  };

  // Handle copy code to clipboard
  const handleCopyCode = async (id: string, code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      alert("Failed to copy code to clipboard");
    }
  };

  // Format date
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  if (experiments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Code2 className="mb-4 h-16 w-16 text-zinc-700" />
        <h3 className="mb-2 text-xl font-semibold text-zinc-300">
          No experiments saved yet
        </h3>
        <p className="text-zinc-500">
          Generate your first lab record and save it to see it here.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {experiments.map((experiment) => (
        <Card
          key={experiment.id}
          className="group border-zinc-800 bg-zinc-900/50 transition-all duration-200 hover:border-zinc-700 hover:bg-zinc-900"
        >
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-2">
              <CardTitle className="text-lg font-semibold text-white">
                {experiment.subject}
              </CardTitle>
              <span className="flex shrink-0 items-center gap-1 text-xs text-zinc-500">
                <Calendar className="h-3 w-3" />
                {formatDate(experiment.createdAt)}
              </span>
            </div>
            <CardDescription className="line-clamp-2 text-zinc-400">
              {experiment.aim}
            </CardDescription>
          </CardHeader>

          <CardContent className="pb-3">
            <div className="rounded-md bg-zinc-800/50 p-3">
              <pre className="line-clamp-3 overflow-hidden text-xs text-zinc-400">
                {experiment.code.substring(0, 150)}...
              </pre>
            </div>
          </CardContent>

          <CardFooter className="flex gap-2 border-t border-zinc-800 pt-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleCopyCode(experiment.id, experiment.code)}
              className="flex-1 border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white"
            >
              {copiedId === experiment.id ? (
                <>
                  <Check className="mr-1.5 h-3.5 w-3.5 text-emerald-400" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="mr-1.5 h-3.5 w-3.5" />
                  Copy Code
                </>
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDelete(experiment.id)}
              disabled={deletingId === experiment.id}
              className="border-red-900/50 text-red-400 hover:border-red-800 hover:bg-red-950/50 hover:text-red-300"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
