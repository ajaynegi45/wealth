import { Wallet } from "lucide-react";

export default function Loading() {
  return (
    <div className="w-full h-full flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center animate-pulse">
        <Wallet className="w-12 h-12 text-tint/50 mb-4" />
        <p className="text-foreground/50 font-medium">Loading Dashboard...</p>
      </div>
    </div>
  );
}
