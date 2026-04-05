'use client';

import { useState, useEffect, useRef } from 'react';
import { Send, SmilePlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useChatStore } from '@/store/chatStore';

const REACTIONS = ['👍', '❤️', '😂', '🎉', '👏', '🔥'];

function MessageItem({ message, onReact }) {
  const [showReactions, setShowReactions] = useState(false);

  return (
    <div
      className="group flex gap-2.5 py-2 px-3 rounded-lg hover:bg-secondary/20 transition-colors relative"
      onMouseLeave={() => setShowReactions(false)}
    >
      <Avatar className="w-7 h-7 shrink-0 mt-0.5">
        <AvatarImage src={message.senderAvatar} />
        <AvatarFallback className="text-xs bg-brand-violet/20 text-brand-violet">
          {message.senderName?.charAt(0) ?? '?'}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2">
          <span className="text-xs font-medium">{message.senderName ?? 'Unknown'}</span>
          <span className="text-[10px] text-muted-foreground">
            {message.timestamp
              ? new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
              : ''}
          </span>
        </div>
        <p className={`text-sm mt-0.5 ${message.type === 'ai' ? 'text-brand-cyan' : ''}`}>
          {message.content}
        </p>
        {message.reactions?.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {message.reactions.map((r, i) => (
              <span key={i} className="text-xs glass rounded px-1.5 py-0.5 cursor-pointer hover:scale-110 transition-transform">
                {r.emoji}
              </span>
            ))}
          </div>
        )}
      </div>
      <button
        className="opacity-0 group-hover:opacity-100 transition-opacity absolute right-2 top-2 text-muted-foreground hover:text-foreground"
        onClick={() => setShowReactions((v) => !v)}
        aria-label="Add reaction"
      >
        <SmilePlus className="w-3.5 h-3.5" />
      </button>
      {showReactions && (
        <div className="absolute right-2 top-8 z-10 glass rounded-lg p-1.5 flex gap-1">
          {REACTIONS.map((emoji) => (
            <button
              key={emoji}
              className="text-sm hover:scale-125 transition-transform"
              onClick={() => { onReact(message._id, emoji); setShowReactions(false); }}
            >
              {emoji}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function ChatPanel({ roomId, socket, user }) {
  const [input, setInput] = useState('');
  const bottomRef = useRef(null);
  const { messages, addMessage, addReaction } = useChatStore();

  useEffect(() => {
    if (!socket) return;
    const handleMessage = (msg) => addMessage(msg);
    socket.on('chat:message', handleMessage);
    return () => socket.off('chat:message', handleMessage);
  }, [socket, addMessage]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim() || !socket) return;
    socket.emit('chat:message', {
      roomId,
      userId: user?.id,
      content: input.trim(),
      type: 'text',
    });
    setInput('');
  };

  const handleReact = (messageId, emoji) => {
    if (!socket) return;
    socket.emit('chat:reaction', { roomId, messageId, emoji, userId: user?.id });
    addReaction(messageId, { emoji, userId: user?.id });
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-border/50">
        <h2 className="font-display font-semibold">Chat</h2>
        <p className="text-xs text-muted-foreground mt-0.5">{messages.length} messages</p>
      </div>
      <ScrollArea className="flex-1">
        <div className="py-2">
          {messages.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-sm text-muted-foreground">No messages yet. Say hi! 👋</p>
            </div>
          ) : (
            messages.map((msg, i) => (
              <MessageItem key={msg._id ?? i} message={msg} onReact={handleReact} />
            ))
          )}
          <div ref={bottomRef} />
        </div>
      </ScrollArea>
      <div className="p-3 border-t border-border/50">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
            placeholder="Send a message..."
            className="bg-secondary/50 h-9 text-sm"
            aria-label="Chat message input"
          />
          <Button size="sm" onClick={sendMessage} disabled={!input.trim()} className="h-9 px-3">
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
