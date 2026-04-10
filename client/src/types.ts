export type Sender = "user" | "bot";

export interface Message {
  id: string;
  user_id: string;
  content: string;
  sender: Sender;
  created_at: string;
}

export type ConnectionStatus = "connected" | "connecting" | "disconnected";

export type WebSocketIncoming =
  | { type: "connected" }
  | { type: "typing" }
  | { type: "message"; data: Message }
  | { type: "error"; message: string };
