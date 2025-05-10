"use client";

import React, { useState, useRef, useEffect } from 'react';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: Date;
}

interface AIChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSendMessage: (query: string) => Promise<string>;
}

const LoadingDots = () => (
  <div className="flex items-center space-x-1">
    <div className="h-2.5 w-2.5 bg-black rounded-full animate-bounce [animation-delay:-0.3s]"></div>
    <div className="h-2.5 w-2.5 bg-black rounded-full animate-bounce [animation-delay:-0.15s]"></div>
    <div className="h-2.5 w-2.5 bg-black rounded-full animate-bounce"></div>
  </div>
);


const AIChatModal: React.FC<AIChatModalProps> = ({ isOpen, onClose, onSendMessage }) => {
  const [userInput, setUserInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          id: Date.now().toString(),
          sender: 'ai',
          text: "Hello! I'm your AI Assistant. Ask me about Solana, crypto events, or other related topics.",
          timestamp: new Date(),
        }
      ]);
    }
  }, [isOpen]);

  const handleUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    const userMessageText = userInput;
    const newUserMessage: Message = {
      id: `${Date.now()}-user`,
      sender: 'user',
      text: userMessageText,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, newUserMessage]);
    setUserInput('');
    setIsLoadingAI(true);

    try {
      const aiResponseText = await onSendMessage(userMessageText);
      const newAiMessage: Message = {
        id: `${Date.now()}-ai`,
        sender: 'ai',
        text: aiResponseText,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, newAiMessage]);
    } catch (error: any) {
      console.error("Error getting AI response:", error);
      const errorAiMessage: Message = {
        id: `${Date.now()}-ai-error`,
        sender: 'ai',
        text: error.message || "Sorry, I encountered an error. Please try again.",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorAiMessage]);
    } finally {
      setIsLoadingAI(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gp-card-bg w-full max-w-lg rounded-xl shadow-2xl border border-gp-border flex flex-col max-h-[80vh] sm:max-h-[70vh]">
        <div className="flex justify-between items-center p-4 border-b border-gp-border">
          <h3 className="text-xl font-semibold text-gp-bright-green"> Your Solana AI Agent</h3>
          <button
            onClick={onClose}
            className="text-gp-text-secondary hover:text-white transition-colors p-1 rounded-full"
            aria-label="Close chat"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-grow p-4 space-y-4 overflow-y-auto">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div
                className={`max-w-[75%] p-3 rounded-lg shadow ${
                  msg.sender === 'user'
                    ? 'bg-gp-mid-violet text-white rounded-br-none'
                    : 'bg-gp-bright-green text-black rounded-bl-none' // UPDATED
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
              </div>
            </div>
          ))}
          {isLoadingAI && (
            <div className="flex justify-start">
              <div className="max-w-[75%] p-3 rounded-lg shadow bg-gp-bright-green text-black rounded-bl-none">
                <LoadingDots />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleUserSubmit} className="p-4 border-t border-gp-border">
          <div className="flex items-center space-x-2">
            <input
              type="text" value={userInput} onChange={(e) => setUserInput(e.target.value)}
              placeholder="Ask about Solana or crypto events..."
              className="flex-grow bg-gp-input-bg border border-gp-border text-gp-text-light placeholder-gp-text-secondary rounded-lg py-2.5 px-4 focus:outline-none focus:ring-2 focus:ring-gp-bright-green focus:border-transparent"
              disabled={isLoadingAI}
            />
            <button
              type="submit" disabled={isLoadingAI || !userInput.trim()}
              className="bg-gp-mid-violet text-white font-semibold py-2.5 px-5 rounded-lg hover:opacity-80 transition-opacity duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AIChatModal;
