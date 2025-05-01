import React, { useState, useRef, useEffect } from 'react';
import { ChatInput } from './ChatInput';
import { ChatMessage } from './ChatMessage';
import { ChatHistory } from './ChatHistory';
import { Header } from '../layout/Header';
import { Button } from '@/components/ui/button';
import { ChevronDown } from 'lucide-react';
import { useChat } from '@/contexts/ChatContext';
import { AnimatePresence, motion } from 'framer-motion';

const GEMINI_API_KEY = 'AIzaSyCmWQEciHfrAfXkJ2TtmYU8p6f4AhiiG2I';
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

export function ChatInterface() {
  const [isChatStarted, setIsChatStarted] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { activeChat, isProcessing, setActiveChat, setIsProcessing } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeChat?.messages]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const sendMessage = async (message: string) => {
    setIsProcessing(true);
    setIsChatStarted(true);

    try {
      const response = await fetch(GEMINI_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: message }] }],
        }),
      });

      const data = await response.json();
      const reply =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ??
        '⚠️ No response received. Please try again.';

      setActiveChat((prevChat) => ({
        ...prevChat,
        messages: [
          ...prevChat.messages,
          {
            id: Date.now().toString(),
            content: message,
            sender: 'user',
            timestamp: new Date().toISOString(),
          },
          {
            id: (Date.now() + 1).toString(),
            content: reply,
            sender: 'bot',
            timestamp: new Date().toISOString(),
          },
        ],
      }));
    } catch (error) {
      console.error('Error fetching response:', error);
    }

    setIsProcessing(false);
  };

  return (
    <>
      <Header onToggleSidebar={toggleSidebar} />
      <ChatHistory isExpanded={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <main className="min-h-[calc(100vh-4rem)] pb-32 pt-8 relative">
        <div className="container max-w-4xl">
          <AnimatePresence>
            {!isChatStarted ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center mb-12 max-w-lg mx-auto"
              >
                <h1 className="text-3xl sm:text-4xl font-bold mb-4 law-gradient">
                  DOJ AI Assistant
                </h1>
                <p className="text-muted-foreground mb-4">
                  Your intelligent legal assistant powered by AI. Ask questions about contracts, rights, property laws, and more.
                </p>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 flex justify-center"
              >
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  className="text-xs text-muted-foreground flex items-center gap-1"
                >
                  <ChevronDown className="h-3 w-3" />
                  <span>Scroll to top</span>
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          {activeChat && activeChat.messages.length > 0 && (
            <div className="space-y-4">
              {activeChat.messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  content={message.content}
                  sender={message.sender}
                  timestamp={new Date(message.timestamp)}
                />
              ))}
              {isProcessing && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <div className="animate-pulse">●</div>
                  <div className="animate-pulse animation-delay-150">●</div>
                  <div className="animate-pulse animation-delay-300">●</div>
                  <span className="text-sm">Generating response...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}

          <ChatInput
            onSendMessage={sendMessage}
            isCentered={activeChat?.messages.length === 0 && !isChatStarted}
            className={activeChat?.messages.length === 0 ? 'mx-auto' : ''}
          />
        </div>
      </main>
    </>
  );
}
