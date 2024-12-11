'use client';

import { Bot, X } from 'lucide-react';

interface ChatHeaderProps {
  onClose: () => void;
}

export function ChatHeader({ onClose }: ChatHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-2">
        <Bot className="h-5 w-5 text-blue-400" />
        <h2 className="text-lg font-semibold">AI Assistant</h2>
      </div>
      <button
        onClick={onClose}
        className="h-8 w-8 rounded-full flex items-center justify-center hover:bg-white/[0.1] transition-colors"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}