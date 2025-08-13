import React, { createContext, useContext, useState, ReactNode } from "react";

export type ChatMessage = {
  id: string;
  role: "user" | "bot" | "thinking";
  text: string;
  confidence?: number;
  urgency?: "low" | "medium" | "high" | "emergency";
  recommendations?: string[];
  doctorInfo?: {
    id: number;
    name: string;
    specialty: string;
    location: string;
    rating: number;
  };
};

type ChatContextType = {
  messages: ChatMessage[];
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  isProcessing: boolean;
  setIsProcessing: React.Dispatch<React.SetStateAction<boolean>>;
  refreshChat: () => void;
  resetChat: () => void;
  hasResponses: boolean;
};

const ChatContext = createContext<ChatContextType | undefined>(undefined);

const INITIAL_MESSAGE: ChatMessage = {
  id: "welcome", 
  role: "bot", 
  text: "🩺 Welcome to CatCare AI! I am your intelligent veterinary assistant powered by advanced diagnostic algorithms. Describe your cat symptoms and I will provide professional-grade analysis and recommendations.",
  confidence: 100,
  urgency: "low"
};

export const ChatProvider = ({ children }: { children: ReactNode }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE]);
  const [isProcessing, setIsProcessing] = useState(false);

  const refreshChat = () => {
    console.log("ChatContext: Refreshing chat...");
    const newWelcomeMessage: ChatMessage = {
      id: "welcome-" + Date.now(), 
      role: "bot", 
      text: "🩺 Welcome to CatCare AI! I am your intelligent veterinary assistant powered by advanced diagnostic algorithms. Describe your cat symptoms and I will provide professional-grade analysis and recommendations.",
      confidence: 100,
      urgency: "low"
    };
    setMessages([newWelcomeMessage]);
    setIsProcessing(false);
    console.log("ChatContext: Chat refreshed with new welcome message");
  };

  const resetChat = () => {
    console.log("ChatContext: Resetting chat completely");
    setMessages([INITIAL_MESSAGE]);
    setIsProcessing(false);
  };

  const hasResponses = messages.length > 1;

  return (
    <ChatContext.Provider value={{ 
      messages, 
      setMessages, 
      isProcessing, 
      setIsProcessing, 
      refreshChat,
      resetChat,
      hasResponses 
    }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};
