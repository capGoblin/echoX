'use client';

import { useState } from 'react';
import { Message, AIChatProps } from './types';
import { ChatHeader } from './chat-header';
import { MessageList } from './message-list';
import { MessageInput } from './message-input';

export function AIChat({ onClose }: AIChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: 'Hi! I can help you swap tokens across chains. Try asking something like "Swap 1 ETH to USDT on Polygon"',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, newMessage]);
    setInput('');

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: 'I understand you want to perform a swap. Let me analyze the best routes across chains for you...',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
  };

  return (
    <div className="relative overflow-hidden rounded-lg backdrop-blur-2xl bg-black/20 border border-white/[0.08] shadow-xl">
      <div className="absolute inset-0 bg-gradient-to-b from-white/[0.04] to-transparent" />
      <div className="relative p-4">
        <ChatHeader onClose={onClose} />
        <MessageList messages={messages} />
        <MessageInput
          value={input}
          onChange={setInput}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}