import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";
import { useChat } from '@/contexts/ChatContext';

interface ChatInputProps {
  className?: string;
  isCentered: boolean;
}

export function ChatInput({ className, isCentered }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const { sendMessage, isProcessing } = useChat();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    // Auto resize textarea to fit content
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [message]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim() || isProcessing) return;

    await sendMessage(message);
    setMessage('');

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const positionClass = isCentered ? 'chat-input-centered' : 'chat-input-bottom';

  return (
    <div className={`chat-input ${positionClass} ${className || ''}`}>
      <form onSubmit={handleSubmit} className="relative">
        <Textarea
          ref={textareaRef}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={isCentered ? "Ask a legal question..." : "Type your message..."}
          className="pr-12 min-h-12 max-h-48 resize-none rounded-full py-3 shadow-lg"
          disabled={isProcessing}
        />
        <Button
          type="submit"
          size="icon"
          className="absolute right-1.5 top-1.5 rounded-full h-9 w-9"
          disabled={!message.trim() || isProcessing}
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}
