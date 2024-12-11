'use client';

import { Send } from 'lucide-react';

interface MessageInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function MessageInput({ value, onChange, onSubmit }: MessageInputProps) {
  return (
    <form onSubmit={onSubmit} className="relative">
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Describe your swap..."
        className="w-full px-4 py-2 pr-12 rounded-lg bg-white/[0.03] border border-white/[0.1] focus:outline-none focus:ring-2 focus:ring-blue-500/50"
      />
      <button
        type="submit"
        className="absolute right-1 top-1 h-8 w-8 flex items-center justify-center rounded-lg bg-blue-600/20 hover:bg-blue-600/30 transition-colors"
      >
        <Send className="h-4 w-4" />
      </button>
    </form>
  );
}