'use client';

import { useState, useRef, useEffect } from 'react';
import { Brain, Send, Loader2, Mic } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { apiClient } from '@/lib/axios';

function Message({ role, content, streaming }) {
  return (
    <div className={`flex gap-2.5 py-2 px-3 rounded-lg ${role === 'assistant' ? 'bg-brand-violet/5' : ''}`}>
      {role === 'assistant' && (
        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-brand-violet to-brand-cyan flex items-center justify-center shrink-0 mt-0.5">
          <Brain className="w-3.5 h-3.5 text-white" />
        </div>
      )}
      <div className={`flex-1 text-sm leading-relaxed ${role === 'assistant' ? 'text-foreground' : 'text-muted-foreground'}`}>
        {content}
        {streaming && <span className="inline-block w-1.5 h-3.5 bg-brand-cyan ml-0.5 animate-pulse rounded-sm" />}
      </div>
    </div>
  );
}

export function AIAssistantPanel({ roomId }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi! I'm ARIA, your AI meeting assistant. Ask me anything about this meeting, or I can help you take notes and identify action items.",
      streaming: false,
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [transcriptions, setTranscriptions] = useState([]);
  const [activeTab, setActiveTab] = useState('ask');
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const ask = async () => {
    if (!input.trim() || loading) return;
    const question = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: question }]);
    setLoading(true);

    try {
      const userMsg = { role: 'assistant', content: '', streaming: true };
      setMessages((prev) => [...prev, userMsg]);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_SOCKET_URL?.replace('wss:', 'https:').replace('ws:', 'http:') ?? 'http://localhost:8000'}/api/v1/ai/ask`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ question, roomId }),
        }
      );

      const reader = response.body?.getReader();
      if (!reader) return;

      let accumulated = '';
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const text = decoder.decode(value);
        const lines = text.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') break;
            try {
              const parsed = JSON.parse(data);
              if (parsed.chunk) {
                accumulated += parsed.chunk;
                setMessages((prev) => {
                  const updated = [...prev];
                  updated[updated.length - 1] = { role: 'assistant', content: accumulated, streaming: true };
                  return updated;
                });
              }
            } catch {
              // Non-JSON line, skip
            }
          }
        }
      }

      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = { role: 'assistant', content: accumulated, streaming: false };
        return updated;
      });
    } catch {
      setMessages((prev) => [
        ...prev.slice(0, -1),
        { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.', streaming: false },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-border/50">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-brand-violet to-brand-cyan flex items-center justify-center">
            <Brain className="w-3.5 h-3.5 text-white" />
          </div>
          <h2 className="font-display font-semibold">ARIA</h2>
          <Badge className="text-[10px] bg-brand-cyan/10 text-brand-cyan border-brand-cyan/20">AI</Badge>
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => setActiveTab('ask')}
            className={`text-xs px-2.5 py-1 rounded-md transition-colors ${activeTab === 'ask' ? 'bg-brand-violet text-white' : 'text-muted-foreground hover:text-foreground'}`}
          >
            Ask
          </button>
          <button
            onClick={() => setActiveTab('transcript')}
            className={`text-xs px-2.5 py-1 rounded-md transition-colors ${activeTab === 'transcript' ? 'bg-brand-violet text-white' : 'text-muted-foreground hover:text-foreground'}`}
          >
            Live Transcript
          </button>
        </div>
      </div>

      {activeTab === 'ask' ? (
        <>
          <ScrollArea className="flex-1">
            <div className="py-2 space-y-1">
              {messages.map((msg, i) => (
                <Message key={i} {...msg} />
              ))}
              <div ref={bottomRef} />
            </div>
          </ScrollArea>
          <div className="p-3 border-t border-border/50">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); ask(); } }}
                placeholder="Ask ARIA anything..."
                className="bg-secondary/50 h-9 text-sm"
                disabled={loading}
                aria-label="AI assistant input"
              />
              <Button size="sm" onClick={ask} disabled={!input.trim() || loading} className="h-9 px-3 bg-brand-violet hover:bg-brand-violet/90 text-white">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </>
      ) : (
        <ScrollArea className="flex-1">
          <div className="p-3 space-y-3">
            {transcriptions.length === 0 ? (
              <div className="text-center py-12">
                <Mic className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Live transcription will appear here.</p>
                <p className="text-xs text-muted-foreground mt-1">Speak to start transcribing.</p>
              </div>
            ) : (
              transcriptions.map((entry, i) => (
                <div key={i} className="text-sm">
                  <span className="text-xs text-brand-cyan font-medium">{entry.speaker}: </span>
                  <span className="text-muted-foreground">{entry.text}</span>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}
