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
  historyLoading: boolean;
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
  const [historyLoading, setHistoryLoading] = useState(true);

  // Append new messages from WebSocket, filtering out echoes from a
  // stale socket that belongs to a previous user.
  const handleWsMessage = useCallback(
    (message: Message) => {
      if (message.user_id !== currentUser) return;
      setMessages((prev) => {
        if (prev.some((m) => m.id === message.id)) return prev;
        return [...prev, message];
      });
    },
    [currentUser]
  );

  const { status, isTyping, sendMessage } = useWebSocket({
    userId: currentUser,
    onMessage: handleWsMessage,
  });

  // Load history on user switch. The empty state is suppressed while
  // `historyLoading` is true so a quick switch doesn't flash the
  // "the jar is quiet" placeholder.
  useEffect(() => {
    let cancelled = false;
    setHistoryLoading(true);
    setMessages([]);

    fetchMessages(currentUser)
      .then((history) => {
        if (!cancelled) {
          setMessages(history);
          setHistoryLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setHistoryLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [currentUser]);

  const send = useCallback(
    (content: string) => {
      sendMessage(content);
    },
    [sendMessage]
  );

  const switchUser = useCallback((userId: UserId) => {
    setCurrentUser(userId);
  }, []);

  const value: ChatContextValue = {
    state: { messages, currentUser, status, isTyping, historyLoading },
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
