import { useState, useRef, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import api from '../../services/api';
import { X, Send, Loader2, Cpu, Trash2 } from 'lucide-react';

const aiApi = {
  chat: (data) => api.post('/ai/chat', data),
};

const SUGGESTIONS = [
  'GST liability this month kitni hai?',
  'Top 5 customers by sales dikhao',
  'Outstanding receivables kya hai?',
  'GSTR-1 kab file karni hai?',
  'Profit & Loss summary batao',
  'Low stock items kaunse hain?',
];

function Message({ msg }) {
  const isUser = msg.role === 'user';
  return (
    <div style={{
      display: 'flex', gap: 10, marginBottom: 16,
      flexDirection: isUser ? 'row-reverse' : 'row',
    }}>
      <div style={{
        width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
        background: isUser ? 'var(--blue)' : 'linear-gradient(135deg,#7c3aed,#1e4fcc)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: isUser ? 13 : 16, color: '#fff', fontWeight: 700,
      }}>
        {isUser ? 'U' : '🤖'}
      </div>
      <div style={{
        maxWidth: '75%',
        background: isUser ? 'var(--blue)' : 'var(--surface)',
        color: isUser ? '#fff' : 'var(--text)',
        border: isUser ? 'none' : '1px solid var(--border)',
        borderRadius: isUser ? '16px 4px 16px 16px' : '4px 16px 16px 16px',
        padding: '10px 14px', fontSize: 13, lineHeight: 1.65,
        whiteSpace: 'pre-wrap',
      }}>
        {msg.content}
      </div>
    </div>
  );
}

export default function AIAssistant({ onClose }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Namaste! 🙏 Main SmartCA.ai ka AI Assistant hoon.\n\nAap apni company ke accounts ke baare mein koi bhi sawaal puch sakte hain — GST, invoices, P&L, outstanding payments — sab kuch!\n\nMain aapki real data dekh ke jawab dunga.',
    },
  ]);
  const [input, setInput] = useState('');
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const mutation = useMutation({
    mutationFn: (data) => aiApi.chat(data),
    onSuccess: (res) => {
      setMessages(prev => [...prev, { role: 'assistant', content: res.data.response }]);
    },
    onError: () => {
      setMessages(prev => [...prev, { role: 'assistant', content: '⚠️ Kuch problem aa gayi. Please dobara try karein.' }]);
    },
  });

  const send = () => {
    const text = input.trim();
    if (!text || mutation.isPending) return;
    const newMsg = { role: 'user', content: text };
    const updated = [...messages, newMsg];
    setMessages(updated);
    setInput('');
    mutation.mutate({
      message: text,
      history: updated.slice(-10).map(m => ({ role: m.role, content: m.content })),
    });
  };

  const clearChat = () => {
    setMessages([{
      role: 'assistant',
      content: 'Chat clear ho gaya! Koi naya sawaal puchein. 😊',
    }]);
  };

  return (
    <div style={{
      position: 'fixed', bottom: 24, right: 24, width: 420, height: 580,
      background: 'var(--surface)', border: '1px solid var(--border)',
      borderRadius: 20, boxShadow: 'var(--shadow-lg)',
      display: 'flex', flexDirection: 'column', zIndex: 500,
      animation: 'slideUp .2s ease',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px',
        borderBottom: '1px solid var(--border)',
        background: 'linear-gradient(135deg,#1338a8,#2563eb)',
        borderRadius: '20px 20px 0 0',
      }}>
        <div style={{
          width: 38, height: 38, borderRadius: '50%',
          background: 'rgba(255,255,255,.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20,
        }}>🤖</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: '#fff' }}>SmartCA AI Assistant</div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,.65)' }}>
            {mutation.isPending ? '⋯ Soch raha hoon...' : '● Online — aapki data dekh sakta hoon'}
          </div>
        </div>
        <button onClick={clearChat} style={{ background: 'rgba(255,255,255,.15)', border: 'none', color: '#fff', width: 30, height: 30, borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Clear chat">
          <Trash2 size={13} />
        </button>
        <button onClick={onClose} style={{ background: 'rgba(255,255,255,.15)', border: 'none', color: '#fff', width: 30, height: 30, borderRadius: '50%', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <X size={15} />
        </button>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 14px' }}>
        {messages.map((msg, i) => <Message key={i} msg={msg} />)}
        {mutation.isPending && (
          <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#7c3aed,#1e4fcc)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>🤖</div>
            <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '4px 16px 16px 16px', padding: '12px 16px', display: 'flex', gap: 5 }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--blue)', animation: `pulse 1s ease ${i * 0.2}s infinite` }} />
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Quick suggestions */}
      {messages.length < 3 && (
        <div style={{ padding: '0 14px 10px', display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {SUGGESTIONS.map(s => (
            <button key={s} onClick={() => { setInput(s); inputRef.current?.focus(); }}
              style={{ fontSize: 11, padding: '5px 10px', background: 'var(--blue-light)', border: '1px solid var(--border-strong)', borderRadius: 99, cursor: 'pointer', color: 'var(--blue)', fontWeight: 500, transition: 'all .12s' }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--blue-soft)'}
              onMouseLeave={e => e.currentTarget.style.background = 'var(--blue-light)'}>
              {s}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div style={{ padding: '12px 14px', borderTop: '1px solid var(--border)', display: 'flex', gap: 8 }}>
        <input
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
          placeholder="Sawaal puchein... (Enter to send)"
          style={{
            flex: 1, padding: '10px 14px', border: '1.5px solid var(--border)',
            borderRadius: 12, fontSize: 13, outline: 'none',
            background: 'var(--bg)', color: 'var(--text)', fontFamily: 'inherit',
            transition: 'border-color .15s',
          }}
          onFocus={e => e.target.style.borderColor = 'var(--blue)'}
          onBlur={e => e.target.style.borderColor = 'var(--border)'}
        />
        <button onClick={send} disabled={!input.trim() || mutation.isPending}
          style={{
            width: 42, height: 42, borderRadius: 12, border: 'none',
            background: input.trim() && !mutation.isPending ? 'var(--blue)' : 'var(--border)',
            color: '#fff', cursor: input.trim() && !mutation.isPending ? 'pointer' : 'not-allowed',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all .15s', flexShrink: 0,
          }}>
          {mutation.isPending
            ? <Loader2 size={16} style={{ animation: 'spin .6s linear infinite' }} />
            : <Send size={16} />}
        </button>
      </div>
    </div>
  );
}
