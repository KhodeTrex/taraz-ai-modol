import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';
import { geminiService } from '../services/geminiService';
import { chatHistoryService } from '../services/chatHistoryService';
import { Message, MessageSender } from '../types';
import GlassCard from './common/GlassCard';
import Spinner from './common/Spinner';

const Chat: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (currentUser) {
      const history = chatHistoryService.getHistory(currentUser.username);
      setMessages(history);
    }
  }, [currentUser]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    if (currentUser && messages.length > 0) {
        chatHistoryService.saveHistory(currentUser.username, messages);
    }
  }, [messages, currentUser]);

  const handleSend = async () => {
    if (input.trim() === '' || !currentUser) return;

    const userMessage: Message = {
      id: crypto.randomUUID(),
      text: input,
      sender: MessageSender.USER,
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);

    const responseText = await geminiService.getChatResponse(input, currentUser.username, updatedMessages);
    
    const aiMessage: Message = {
      id: crypto.randomUUID(),
      text: responseText,
      sender: MessageSender.AI,
    };

    setMessages([...updatedMessages, aiMessage]);
    setIsLoading(false);
  };
  
  const handleClearHistory = () => {
      if (!currentUser) return;
      chatHistoryService.clearHistory(currentUser.username);
      geminiService.clearChatSession(currentUser.username);
      setMessages([]);
  }

  return (
    <GlassCard className="w-full max-w-3xl mx-auto flex flex-col h-[90vh] transition-all duration-500">
      <div className="flex justify-between items-center pb-4 border-b-2 border-white/50">
        <div>
            <h1 className="text-2xl font-bold text-[var(--color-text-strong)]">چت با هوش مصنوعی</h1>
            <p className="text-[var(--color-text-muted)]">خوش آمدید، {currentUser?.username}!</p>
        </div>
        <div>
            <button onClick={handleClearHistory} className="bg-amber-400 text-white font-bold py-2 px-4 rounded-lg hover:bg-amber-500 transition ml-2 text-sm">پاک کردن</button>
            <button onClick={logout} className="bg-red-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-600 transition text-sm">خروج</button>
        </div>
      </div>

      <div className="flex-grow overflow-y-auto my-4 pl-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-end gap-3 ${
              msg.sender === MessageSender.USER ? 'justify-end' : 'justify-start'
            }`}
          >
            {msg.sender === MessageSender.AI && <div className="w-8 h-8 rounded-full bg-[var(--color-primary)] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">AI</div>}
            <div
              className={`max-w-md p-3 rounded-2xl transition-all duration-300 ${
                msg.sender === MessageSender.USER
                  ? 'bg-[var(--color-primary)] text-white rounded-bl-none'
                  : 'bg-white/80 text-slate-800 rounded-br-none'
              }`}
            >
              <p style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</p>
            </div>
          </div>
        ))}
        {isLoading && (
            <div className="flex items-end gap-3 justify-start">
                <div className="w-8 h-8 rounded-full bg-[var(--color-primary)] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">AI</div>
                <div className="max-w-md p-3 rounded-2xl bg-white/80 text-slate-800 rounded-br-none flex items-center">
                    <Spinner className="h-4 w-4 ml-2" /> ...در حال نوشتن
                </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="mt-auto flex gap-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSend()}
          placeholder="...هر سوالی دارید بپرسید"
          className="flex-grow px-4 py-3 bg-white/70 rounded-lg border border-transparent focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition"
          disabled={isLoading}
        />
        <button
          onClick={handleSend}
          disabled={isLoading}
          className="bg-[var(--color-primary)] text-white font-bold py-3 px-6 rounded-lg hover:bg-[var(--color-primary-dark)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-opacity-50 transition disabled:bg-[var(--color-primary-light)] disabled:cursor-not-allowed"
        >
          ارسال
        </button>
      </div>
    </GlassCard>
  );
};

export default Chat;