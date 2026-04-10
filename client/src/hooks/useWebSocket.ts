import { useCallback, useEffect, useRef, useState } from "react";
import { WS_BASE_URL } from "../config";
import type { ConnectionStatus, Message, WebSocketIncoming } from "../types";

const MAX_RECONNECT_DELAY = 16_000;

interface UseWebSocketReturn {
  status: ConnectionStatus;
  isTyping: boolean;
  lastMessage: Message | null;
  sendMessage: (content: string, userId: string) => void;
}

export function useWebSocket(userId: string): UseWebSocketReturn {
  const [status, setStatus] = useState<ConnectionStatus>("disconnected");
  const [isTyping, setIsTyping] = useState(false);
  const [lastMessage, setLastMessage] = useState<Message | null>(null);

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectDelay = useRef(1_000);
  const reconnectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const shouldReconnect = useRef(true);

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.close();
    }

    setStatus("connecting");
    const ws = new WebSocket(`${WS_BASE_URL}/ws/${userId}`);
    wsRef.current = ws;

    ws.onopen = () => {
      // connected event comes from server, not onopen
    };

    ws.onmessage = (event) => {
      // Ignore messages from a stale connection
      if (wsRef.current !== ws) return;

      const data: WebSocketIncoming = JSON.parse(event.data);

      switch (data.type) {
        case "connected":
          setStatus("connected");
          reconnectDelay.current = 1_000;
          break;
        case "typing":
          setIsTyping(true);
          break;
        case "message":
          setIsTyping(false);
          setLastMessage(data.data);
          break;
        case "error":
          break;
      }
    };

    ws.onclose = () => {
      // Only handle if this is still the active connection.
      // Without this guard, a stale WS closing after a user switch
      // would nullify wsRef and trigger a reconnect to the old user.
      if (wsRef.current !== ws) return;

      setStatus("disconnected");
      setIsTyping(false);
      wsRef.current = null;

      if (shouldReconnect.current) {
        reconnectTimer.current = setTimeout(() => {
          reconnectDelay.current = Math.min(
            reconnectDelay.current * 2,
            MAX_RECONNECT_DELAY
          );
          connect();
        }, reconnectDelay.current);
      }
    };

    ws.onerror = () => {
      ws.close();
    };
  }, [userId]);

  useEffect(() => {
    shouldReconnect.current = true;
    setLastMessage(null);
    setIsTyping(false);
    connect();

    return () => {
      shouldReconnect.current = false;
      if (reconnectTimer.current) {
        clearTimeout(reconnectTimer.current);
      }
      wsRef.current?.close();
    };
  }, [connect]);

  const sendMessage = useCallback((content: string, uId: string) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ content, user_id: uId }));
    }
  }, []);

  return { status, isTyping, lastMessage, sendMessage };
}
