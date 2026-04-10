import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { fetchMessages } from "../api";
import { DEFAULT_USER, type UserId } from "../config";
import { useWebSocket } from "../hooks/useWebSocket";
import type { ConnectionStatus, Message } from "../types";

interface ChatState {
  messages: Message[];
  currentUser: UserId;
  status: ConnectionStatus;
  isTyping: boolean;
}

interface ChatActions {
  send: (content: string) => void;
  switchUser: (userId: UserId) => void;
}

interface ChatContextValue {
  state: ChatState;
  actions: ChatActions;
}

const ChatContext = createContext<ChatContextValue | null>(null);

export function ChatProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<UserId>(DEFAULT_USER);
  const [messages, setMessages] = useState<Message[]>([]);

  const { status, isTyping, lastMessage, sendMessage } =
    useWebSocket(currentUser);

  // Load history on user switch
  useEffect(() => {
    let cancelled = false;

    fetchMessages(currentUser)
      .then((history) => {
        if (!cancelled) {
          setMessages(history);
        }
      })
      .catch(() => {
        // Silently fail — messages will come via WebSocket
      });

    return () => {
      cancelled = true;
    };
  }, [currentUser]);

  // Append new messages from WebSocket (only for current user)
  useEffect(() => {
    if (lastMessage && lastMessage.user_id === currentUser) {
      setMessages((prev) => {
        const exists = prev.some((m) => m.id === lastMessage.id);
        return exists ? prev : [...prev, lastMessage];
      });
    }
  }, [lastMessage, currentUser]);

  const send = useCallback(
    (content: string) => {
      sendMessage(content, currentUser);
    },
    [sendMessage, currentUser]
  );

  const switchUser = useCallback((userId: UserId) => {
    setCurrentUser(userId);
    setMessages([]);
  }, []);

  const value: ChatContextValue = {
    state: { messages, currentUser, status, isTyping },
    actions: { send, switchUser },
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChat(): ChatContextValue {
  const ctx = useContext(ChatContext);
  if (!ctx) {
    throw new Error("useChat must be used within ChatProvider");
  }
  return ctx;
}
