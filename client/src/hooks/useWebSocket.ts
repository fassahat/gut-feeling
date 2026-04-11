import { useCallback, useEffect, useRef, useState } from "react";
import { WS_BASE_URL } from "../config";
import type { ConnectionStatus, Message, WebSocketIncoming } from "../types";

const INITIAL_RECONNECT_DELAY = 1_000;
const MAX_RECONNECT_DELAY = 16_000;

interface UseWebSocketOptions {
  userId: string;
  onMessage: (message: Message) => void;
}

interface UseWebSocketReturn {
  status: ConnectionStatus;
  isTyping: boolean;
  sendMessage: (content: string, userId: string) => void;
}

export function useWebSocket({
  userId,
  onMessage,
}: UseWebSocketOptions): UseWebSocketReturn {
  const [status, setStatus] = useState<ConnectionStatus>("disconnected");
  const [isTyping, setIsTyping] = useState(false);

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectDelay = useRef(INITIAL_RECONNECT_DELAY);
  const reconnectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const shouldReconnect = useRef(true);

  // Keep the latest onMessage without re-subscribing the socket.
  const onMessageRef = useRef(onMessage);
  onMessageRef.current = onMessage;

  useEffect(() => {
    shouldReconnect.current = true;
    setIsTyping(false);

    const closeActiveSocket = () => {
      const prev = wsRef.current;
      if (prev && prev.readyState !== WebSocket.CLOSED) {
        prev.close();
      }
      wsRef.current = null;
    };

    const connect = () => {
      closeActiveSocket();

      setStatus("connecting");
      const ws = new WebSocket(`${WS_BASE_URL}/ws/${userId}`);
      wsRef.current = ws;

      ws.onopen = () => {
        if (wsRef.current !== ws) return;
        setStatus("connected");
        reconnectDelay.current = INITIAL_RECONNECT_DELAY;
      };

      ws.onmessage = (event) => {
        // Ignore messages from a stale connection
        if (wsRef.current !== ws) return;

        let data: WebSocketIncoming;
        try {
          data = JSON.parse(event.data);
        } catch (err) {
          console.warn("Failed to parse WS message", err);
          return;
        }

        switch (data.type) {
          case "connected":
            // Server handshake ack; onopen already flipped status.
            break;
          case "typing":
            setIsTyping(true);
            break;
          case "message":
            setIsTyping(false);
            onMessageRef.current(data.data);
            break;
          case "error":
            console.warn("WS server error:", data.message);
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
    };

    connect();

    return () => {
      shouldReconnect.current = false;
      if (reconnectTimer.current) {
        clearTimeout(reconnectTimer.current);
        reconnectTimer.current = null;
      }
      closeActiveSocket();
    };
  }, [userId]);

  const sendMessage = useCallback((content: string, uId: string) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ content, user_id: uId }));
    }
  }, []);

  return { status, isTyping, sendMessage };
}
