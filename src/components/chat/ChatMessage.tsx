import React from 'react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Scale } from 'lucide-react';

interface ChatMessageProps {
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

export function ChatMessage({ content, sender, timestamp }: ChatMessageProps) {
  const isAI = sender === 'ai';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "flex items-start gap-3 mb-6",
        isAI ? "justify-start" : "justify-end"
      )}
    >
      <Avatar className={cn(
        "flex-shrink-0",
        isAI ? "bg-primary/10" : "bg-secondary/80"
      )}>
        <AvatarFallback>
          {isAI ? <Scale size={16} /> : 'U'}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1">
        <div className="flex items-baseline gap-2 mb-1">
          <span className="font-medium text-sm">
            {isAI ? 'AI' : 'You'}
          </span>
          <span className="text-xs text-muted-foreground">
            {new Date(timestamp).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit'
            })}
          </span>
        </div>

        <div className={cn(
          "prose prose-sm max-w-none",
          "prose-p:leading-relaxed prose-pre:rounded-md",
          isAI ? "bg-primary/10 p-3 rounded-md" : "bg-secondary/80 p-3 rounded-md"
        )}>
          {content.split('\n').map((line, i) => (
            <React.Fragment key={i}>
              {line}
              {i !== content.split('\n').length - 1 && <br />}
            </React.Fragment>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
