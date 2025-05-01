
import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Trash2, MessageSquare } from 'lucide-react';
import { useChat } from '@/contexts/ChatContext';
import { cn } from '@/lib/utils';

interface ChatHistoryProps {
  isExpanded: boolean;
  onClose: () => void;
}

export function ChatHistory({ isExpanded, onClose }: ChatHistoryProps) {
  const { chats, activeChat, dispatch } = useChat();
  
  const setActiveChat = (chatId: string) => {
    dispatch({ type: 'SET_ACTIVE_CHAT', payload: { chatId } });
    if (window.innerWidth < 768) {
      onClose(); // Close sidebar on mobile after selecting a chat
    }
  };
  
  const deleteChat = (e: React.MouseEvent, chatId: string) => {
    e.stopPropagation();
    dispatch({ type: 'DELETE_CHAT', payload: { chatId } });
  };
  
  const createNewChat = () => {
    dispatch({ type: 'CREATE_CHAT', payload: { title: 'New Chat' } });
    if (window.innerWidth < 768) {
      onClose();
    }
  };
  
  return (
    <div className={`chat-history-panel ${isExpanded ? 'panel-expanded' : 'panel-collapsed'}`}>
      <div className="p-4 border-b">
        <h2 className="font-bold text-lg flex items-center">
          <MessageSquare className="mr-2 h-5 w-5" />
          Chat History
        </h2>
        <Button 
          onClick={createNewChat}
          variant="default"
          className="w-full mt-4"
        >
          + New Chat
        </Button>
      </div>
      
      <ScrollArea className="h-[calc(100vh-100px)]">
        <div className="p-2">
          {chats.length > 0 ? (
            chats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => setActiveChat(chat.id)}
                className={cn(
                  "flex items-center justify-between p-3 rounded-md mb-1 cursor-pointer hover:bg-muted group",
                  activeChat?.id === chat.id ? "bg-muted" : ""
                )}
              >
                <div className="truncate flex-1">
                  <h3 className="font-medium text-sm truncate">{chat.title}</h3>
                  <p className="text-xs text-muted-foreground truncate">
                    {new Date(chat.updatedAt).toLocaleDateString()}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => deleteChat(e, chat.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))
          ) : (
            <div className="text-center p-4 text-muted-foreground">
              No chat history yet
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
