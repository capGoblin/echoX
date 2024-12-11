'use client';

import { motion } from 'framer-motion';
import { Message } from './types';

interface MessageListProps {
  messages: Message[];
}

export function MessageList({ messages }: MessageListProps) {
  return (
    <div className="h-[400px] overflow-y-auto pr-4 mb-4 scrollbar-thin">
      <div className="space-y-4">
        {messages.map((message) => (
          <motion.div
            key={message.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                message.type === 'user'
                  ? 'bg-blue-600/20 text-white'
                  : 'bg-white/[0.03] border border-white/[0.1]'
              }`}
            >
              <p className="text-sm">{message.content}</p>
              <time className="text-xs text-muted-foreground mt-1 block">
                {message.timestamp.toLocaleTimeString()}
              </time>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}