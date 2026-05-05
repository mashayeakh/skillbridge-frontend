import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4">
      <div className="relative">
        <div className="h-16 w-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
        <Loader2 className="h-8 w-8 text-primary animate-pulse absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
      </div>
      <div className="space-y-2 text-center">
        <h3 className="text-lg font-black tracking-tight text-foreground">Syncing Dashboard...</h3>
        <p className="text-sm text-muted-foreground font-medium animate-pulse">Preparing your workspace</p>
      </div>
    </div>
  );
}
