'use client';

import { useState } from 'react';
import { SwapView } from './swap-view';
import { ChatView } from './chat-view';

export function CardContainer() {
  const [isChat, setIsChat] = useState(false);

  return (
    <div className="relative w-full max-w-md">
      {isChat ? (
        <ChatView onClose={() => setIsChat(false)} />
      ) : (
        <SwapView onChatClick={() => setIsChat(true)} />
      )}
    </div>
  );
}