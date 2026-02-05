import { Heart } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-zinc-800 bg-zinc-950">
      <div className="container mx-auto flex flex-col items-center justify-center gap-2 px-4 py-6">
        <p className="flex items-center gap-1.5 text-sm text-zinc-500">
          Built with
          <Heart className="h-4 w-4 fill-red-500 text-red-500" />
          for Engineers
        </p>
        <p className="text-xs text-zinc-600">
          © {new Date().getFullYear()} LabSnap. Generate lab records effortlessly.
        </p>
      </div>
    </footer>
  );
}
