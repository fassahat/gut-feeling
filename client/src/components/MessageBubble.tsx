import { memo, useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";
import { palette, typography, spacing, radii } from "../theme";
import type { Sender } from "../types";

interface MessageBubbleProps {
  content: string;
  sender: Sender;
  timestamp: string;
}

function MessageBubbleRaw({ content, sender, timestamp }: MessageBubbleProps) {
  const isBot = sender === "bot";
  const time = useMemo(
    () =>
      new Date(timestamp).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    [timestamp]
  );

  return (
    <View style={[styles.row, isBot ? styles.rowBot : styles.rowUser]}>
      {isBot ? (
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>🫧</Text>
        </View>
      ) : null}
      <View style={styles.bubbleColumn}>
        {isBot ? <Text style={styles.senderLabel}>Nurse Bubbles</Text> : null}
        <View
          style={[styles.bubble, isBot ? styles.bubbleBot : styles.bubbleUser]}
        >
          <Text
            style={[styles.text, isBot ? styles.textBot : styles.textUser]}
          >
            {content}
          </Text>
        </View>
        <Text style={[styles.time, isBot ? styles.timeBot : styles.timeUser]}>
          {time}
        </Text>
      </View>
    </View>
  );
}

export const MessageBubble = memo(MessageBubbleRaw);

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  rowBot: {
    alignItems: "flex-start",
    paddingRight: spacing.xxxl,
  },
  rowUser: {
    justifyContent: "flex-end",
    paddingLeft: spacing.xxxl,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: palette.amber100,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: palette.amber200,
    marginTop: 18,
  },
  avatarText: {
    fontSize: 18,
  },
  bubbleColumn: {
    flexShrink: 1,
    maxWidth: "85%",
  },
  senderLabel: {
    fontSize: typography.xs,
    fontWeight: typography.semibold,
    color: palette.amber600,
    marginBottom: 3,
    marginLeft: spacing.xs,
    letterSpacing: 0.3,
    textTransform: "uppercase",
  },
  bubble: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderCurve: "continuous",
  },
  bubbleBot: {
    backgroundColor: palette.white,
    borderRadius: radii.lg,
    borderTopLeftRadius: radii.sm,
    borderWidth: 1,
    borderColor: palette.linen,
    shadowColor: palette.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  bubbleUser: {
    backgroundColor: palette.culture700,
    borderRadius: radii.lg,
    borderTopRightRadius: radii.sm,
    shadowColor: palette.culture700,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  text: {
    fontSize: typography.base,
    lineHeight: 22,
  },
  textBot: {
    color: palette.espresso,
  },
  textUser: {
    color: palette.white,
  },
  time: {
    fontSize: typography.xs,
    marginTop: spacing.xs,
  },
  timeBot: {
    color: palette.amber400,
    marginLeft: spacing.xs,
  },
  timeUser: {
    color: palette.culture300,
    textAlign: "right",
    marginRight: spacing.xs,
  },
});
