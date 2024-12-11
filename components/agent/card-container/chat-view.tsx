'use client';

import { AIChat } from '@/components/agent/chat/ai-chat';

interface ChatViewProps {
  onClose: () => void;
}

export function ChatView({ onClose }: ChatViewProps) {
  return <AIChat onClose={onClose} />;
}