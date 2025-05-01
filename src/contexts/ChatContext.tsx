import React, { createContext, useContext, useState, useReducer, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

interface Chat {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

type ChatAction =
  | { type: 'CREATE_CHAT'; payload: { title: string } }
  | { type: 'DELETE_CHAT'; payload: { chatId: string } }
  | { type: 'ADD_MESSAGE'; payload: { chatId: string; message: Message } }
  | { type: 'SET_ACTIVE_CHAT'; payload: { chatId: string } }
  | { type: 'LOAD_CHATS'; payload: { chats: Chat[] } };

interface ChatContextType {
  chats: Chat[];
  activeChat: Chat | null;
  dispatch: React.Dispatch<ChatAction>;
  sendMessage: (content: string) => Promise<void>;
  isProcessing: boolean;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

// Chat reducer
const chatReducer = (state: { chats: Chat[]; activeChat: Chat | null }, action: ChatAction) => {
  switch (action.type) {
    case 'CREATE_CHAT': {
      const newChat: Chat = {
        id: `chat-${Date.now()}`,
        title: action.payload.title,
        messages: [],
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const updatedChats = [...state.chats, newChat];
      return { ...state, chats: updatedChats, activeChat: newChat };
    }

    case 'DELETE_CHAT': {
      const updatedChats = state.chats.filter(chat => chat.id !== action.payload.chatId);
      return {
        ...state,
        chats: updatedChats,
        activeChat: state.activeChat?.id === action.payload.chatId
          ? (updatedChats[0] || null)
          : state.activeChat
      };
    }

    case 'ADD_MESSAGE': {
      const updatedChats = state.chats.map(chat => {
        if (chat.id === action.payload.chatId) {
          return {
            ...chat,
            messages: [...chat.messages, action.payload.message],
            updatedAt: new Date(),
            title: chat.title === 'New Chat' && chat.messages.length === 0
              ? action.payload.message.content.substring(0, 30) + '...'
              : chat.title
          };
        }
        return chat;
      });

      const updatedActiveChat = state.activeChat?.id === action.payload.chatId
        ? updatedChats.find(chat => chat.id === action.payload.chatId) || null
        : state.activeChat;

      return {
        ...state,
        chats: updatedChats,
        activeChat: updatedActiveChat
      };
    }

    case 'SET_ACTIVE_CHAT': {
      return {
        ...state,
        activeChat: state.chats.find(chat => chat.id === action.payload.chatId) || null
      };
    }

    case 'LOAD_CHATS': {
      return {
        ...state,
        chats: action.payload.chats,
        activeChat: action.payload.chats[0] || null
      };
    }

    default:
      return state;
  }
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  // Initialize with stored chats or empty array
  const initialChats = JSON.parse(localStorage.getItem('legalAIChats') || '[]');

  const [state, dispatch] = useReducer(chatReducer, {
    chats: initialChats,
    activeChat: initialChats[0] || null
  });

  // Persist chats to localStorage on changes
  useEffect(() => {
    localStorage.setItem('legalAIChats', JSON.stringify(state.chats));
  }, [state.chats]);

  const GEMINI_API_KEY = 'AIzaSyCmWQEciHfrAfXkJ2TtmYU8p6f4AhiiG2I';
  const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' + GEMINI_API_KEY;

  // Send message function
  const sendMessage = async (content: string) => {
    if (!state.activeChat) {
      // Create a new chat if none exists
      dispatch({
        type: 'CREATE_CHAT',
        payload: { title: 'New Chat' }
      });
    }

    const chatId = state.activeChat?.id || `chat-${Date.now()}`;

    // Add user message
    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      content,
      sender: 'user',
      timestamp: new Date()
    };

    dispatch({
      type: 'ADD_MESSAGE',
      payload: { chatId, message: userMessage }
    });

    // Process AI response
    try {
      setIsProcessing(true);

      const response = await fetch(GEMINI_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: content }] }],
        }),
      });

      const data = await response.json();
      const aiResponse = data.candidates[0].content.parts[0].text;

      const aiMessage: Message = {
        id: `msg-${Date.now()}`,
        content: aiResponse,
        sender: 'ai',
        timestamp: new Date()
      };

      dispatch({
        type: 'ADD_MESSAGE',
        payload: { chatId, message: aiMessage }
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get AI response. Please try again.",
        variant: "destructive"
      });
      console.error("Error getting AI response:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <ChatContext.Provider value={{ ...state, dispatch, sendMessage, isProcessing }}>
      {children}
    </ChatContext.Provider>
  );
};
