import { memo } from "react";
import { StyleSheet, Text, View } from "react-native";
import type { Sender } from "../types";

interface MessageBubbleProps {
  content: string;
  sender: Sender;
  timestamp: string;
}

function MessageBubbleRaw({ content, sender, timestamp }: MessageBubbleProps) {
  const isBot = sender === "bot";
  const time = new Date(timestamp).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <View style={[styles.row, isBot ? styles.rowBot : styles.rowUser]}>
      <View
        style={[styles.bubble, isBot ? styles.bubbleBot : styles.bubbleUser]}
      >
        <Text
          style={[styles.text, isBot ? styles.textBot : styles.textUser]}
        >
          {content}
        </Text>
        <Text
          style={[styles.time, isBot ? styles.timeBot : styles.timeUser]}
        >
          {time}
        </Text>
      </View>
    </View>
  );
}

export const MessageBubble = memo(MessageBubbleRaw);

const styles = StyleSheet.create({
  row: {
    paddingHorizontal: 12,
  },
  rowBot: {
    alignItems: "flex-start",
  },
  rowUser: {
    alignItems: "flex-end",
  },
  bubble: {
    maxWidth: "80%",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
    borderCurve: "continuous",
  },
  bubbleBot: {
    backgroundColor: "#FFF3E0",
    borderBottomLeftRadius: 4,
  },
  bubbleUser: {
    backgroundColor: "#00897B",
    borderBottomRightRadius: 4,
  },
  text: {
    fontSize: 15,
    lineHeight: 21,
  },
  textBot: {
    color: "#333",
  },
  textUser: {
    color: "#FFF",
  },
  time: {
    fontSize: 11,
    marginTop: 4,
  },
  timeBot: {
    color: "#999",
  },
  timeUser: {
    color: "rgba(255,255,255,0.7)",
  },
});
