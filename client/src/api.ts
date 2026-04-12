import { API_BASE_URL, API_TOKEN } from "./config";
import type { Message } from "./types";

export async function fetchMessages(userId: string): Promise<Message[]> {
  const response = await fetch(
    `${API_BASE_URL}/api/messages?user_id=${encodeURIComponent(userId)}`,
    { headers: { Authorization: `Bearer ${API_TOKEN}` } }
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch messages: ${response.status}`);
  }

  return response.json();
}
