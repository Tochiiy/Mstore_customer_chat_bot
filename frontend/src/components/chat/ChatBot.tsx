import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User } from 'lucide-react';
import { shopApi } from '../../services/api';
import type { ChatMessage } from '../../types';

export const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'bot',
      text: 'Hi! I am your AI shop assistant. What kind of products are you looking for today?',
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await shopApi.sendChatMessage(userMsg.text, messages);
      
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: response.response  || "I found some great options for you.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error("Chat error:", error);
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: "Sorry, I'm having trouble connecting to the server right now.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Window */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col h-[500px] transition-all">
          
          {/* Header */}
          <div className="bg-slate-900 text-white p-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Bot size={20} className="text-cyan-400" />
              <span className="font-semibold">AI Assistant ֎</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:text-slate-300 transition-colors">
              <X size={20} />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-5 bg-slate-50">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex gap-3 items-end ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
              >
                {/* Avatar Icon */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm ${
                  msg.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-slate-900 text-cyan-400'
                }`}>
                  {msg.sender === 'user' ? <User size={16} strokeWidth={2.5} /> : <Bot size={16} strokeWidth={2.5} />}
                </div>

                {/* Message Bubble */}
                <div className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                  msg.sender === 'user' 
                    ? 'bg-blue-600 text-white rounded-br-sm shadow-md' 
                    : 'bg-white border border-slate-200 text-slate-800 rounded-bl-sm shadow-sm'
                }`}>
                  <p className="text-sm leading-relaxed">{msg.text}</p>
                </div>
              </div>
            ))}
            
            {/* Loading Indicator with Bot Icon */}
            {isLoading && (
              <div className="flex gap-3 items-end flex-row">
                <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm bg-slate-900 text-cyan-400">
                  <Bot size={16} strokeWidth={2.5} />
                </div>
                <div className="bg-white border border-slate-200 text-slate-500 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm flex gap-1 items-center">
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></div>
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 bg-white border-t border-slate-100 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask about shoes..."
              className="flex-1 border border-slate-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all bg-slate-50"
            />
            <button 
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className="bg-slate-900 text-white p-2 rounded-xl hover:bg-slate-800 disabled:opacity-50 transition-all active:scale-95 flex items-center justify-center w-10 h-10"
            >
              <Send size={18} className="ml-0.5" />
            </button>
          </div>
        </div>
      )}

      {/* Floating Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-slate-900 text-white p-4 rounded-full shadow-lg hover:shadow-xl hover:bg-slate-800 transition-all hover:-translate-y-1 flex items-center justify-center relative group"
        >
          <Bot size={24} className="group-hover:text-cyan-400 transition-colors" />
          {/* Notification Dot */}
          <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-red-500 border-2 border-slate-900 rounded-full"></span>
        </button>
      )}
    </div>
  );
};