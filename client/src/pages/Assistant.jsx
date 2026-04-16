import { useState, useRef, useEffect } from 'react';
import { useChat } from '../context/ChatContext';

function MessageBubble({ msg }) {
  const isUser = msg.role === 'user';

  return (
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} mb-6`}>
      <div className={`flex gap-4 max-w-[80%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        {/* Avatar */}
        <div className={`w-8 h-8 rounded-full flex shrink-0 items-center justify-center text-white text-xs font-bold ${isUser ? 'bg-on-surface' : 'bg-primary'}`}>
          {isUser ? 'AR' : <span className="material-symbols-outlined text-[16px]">psychology</span>}
        </div>
        
        {/* Content */}
        <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
          <div className={isUser ? 'bubble-user' : 'bubble-ai'}>
            {!isUser && msg.metrics ? (
              <div>
                <p className="text-sm leading-relaxed whitespace-pre-wrap mb-4">{msg.content}</p>
                <div className="grid grid-cols-2 gap-3 mt-3 pt-3 border-t border-surface-border">
                  {msg.metrics.map((m, i) => (
                    <div key={i} className="bg-surface p-3 rounded-lg border border-surface-border">
                      <span className="text-xs font-semibold text-on-surface-variant uppercase">{m.label}</span>
                      <div className="mt-1">
                        <span className="text-xl font-bold text-on-surface">{m.value}</span>
                        <span className="text-xs text-on-surface-light ml-1">{m.unit}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
            )}
          </div>
          <span className="text-[10px] text-on-surface-light mt-1 px-1">{msg.timestamp || 'Just now'}</span>
        </div>
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex w-full justify-start mb-6">
      <div className="flex gap-4 max-w-[80%] flex-row">
        <div className="w-8 h-8 rounded-full bg-primary flex shrink-0 items-center justify-center text-white">
          <span className="material-symbols-outlined text-[16px] animate-pulse">psychology</span>
        </div>
        <div className="bubble-ai px-5 py-4 flex items-center gap-1.5 h-[44px]">
          <div className="w-2 h-2 bg-on-surface-variant rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
          <div className="w-2 h-2 bg-on-surface-variant rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
          <div className="w-2 h-2 bg-on-surface-variant rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
        </div>
      </div>
    </div>
  );
}

export default function Assistant() {
  const { messages, isLoading, sendMessage } = useChat();
  const [input, setInput] = useState('');
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    sendMessage(input.trim());
    setInput('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) handleSend(e);
  };

  return (
    <div className="pt-16 lg:pl-64 h-screen flex flex-col bg-surface">
      
      {/* Scrollable messages container */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6">
        <div className="max-w-3xl mx-auto py-8">
          
          {/* Header Info */}
          <div className="text-center mb-8 border-b border-surface-border pb-6">
            <h2 className="text-2xl font-bold text-on-surface">EcoSense Assistant</h2>
            <p className="text-sm text-on-surface-variant mt-1">Ask me about your footprint, carbon context, or logging an action.</p>
          </div>

          {messages.map((msg, i) => (
            <MessageBubble key={i} msg={msg} />
          ))}
          {isLoading && <TypingIndicator />}
          <div ref={bottomRef} className="h-4" />
        </div>
      </div>

      {/* Fixed bottom input container */}
      <div className="bg-white border-t border-surface-border px-4 py-4 sm:px-6 z-10 relative">
        <div className="max-w-3xl mx-auto relative">
          <form onSubmit={handleSend} className="relative flex items-end shadow-sm">
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask me to log a trip, suggest an eco recipe..."
              rows={Math.min(Math.max(input.split('\n').length, 1), 4)}
              className="w-full bg-surface border border-surface-border rounded-xl pl-4 pr-14 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none shadow-sm"
              style={{ minHeight: '48px' }}
            />
            <div className="absolute right-2 bottom-2 max-h-full flex items-center mb-0.5">
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="w-8 h-8 flex items-center justify-center bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="material-symbols-outlined text-[18px]">send</span>
              </button>
            </div>
          </form>
          <div className="mt-2 text-center">
            <span className="text-[10px] text-on-surface-light">EcoSense AI may produce inaccurate information about environmental claims. Verify important data.</span>
          </div>
        </div>
      </div>

    </div>
  );
}
