import { cn } from "@/lib/utils";

interface LoaderProps {
  className?: string;
}

export function SwapLoader({ className }: LoaderProps) {
  return (
    <div className={cn("flex items-center justify-center", className)}>
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 border-t-2 border-blue-500 rounded-full animate-spin"></div>
        <div className="absolute inset-2 border-r-2 border-blue-400 rounded-full animate-spin-reverse"></div>
        <div className="absolute inset-4 border-b-2 border-blue-300 rounded-full animate-spin"></div>
      </div>
    </div>
  );
}

export function ChatLoader({ className }: LoaderProps) {
  return (
    <div className={cn("flex items-center justify-center gap-1", className)}>
      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
      <div className="w-2 h-2 bg-blue-300 rounded-full animate-bounce"></div>
    </div>
  );
} 