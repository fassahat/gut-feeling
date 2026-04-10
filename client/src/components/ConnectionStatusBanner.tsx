import { StyleSheet, Text, View } from "react-native";
import { palette, typography, spacing } from "../theme";
import type { ConnectionStatus } from "../types";

const STATUS_CONFIG: Record<
  ConnectionStatus,
  { label: string; emoji: string; bg: string; fg: string; border: string }
> = {
  connected: {
    label: "Culture is alive",
    emoji: "🟢",
    bg: palette.culture100,
    fg: palette.culture700,
    border: palette.culture300,
  },
  connecting: {
    label: "Brewing connection...",
    emoji: "🍵",
    bg: palette.amber100,
    fg: palette.amber800,
    border: palette.amber200,
  },
  disconnected: {
    label: "Culture dormant",
    emoji: "💤",
    bg: "#FDE8E8",
    fg: palette.rosehip,
    border: "#F5C6C6",
  },
};

interface ConnectionStatusBannerProps {
  status: ConnectionStatus;
}

export function ConnectionStatusBanner({
  status,
}: ConnectionStatusBannerProps) {
  if (status === "connected") {
    return null;
  }

  const config = STATUS_CONFIG[status];

  return (
    <View
      style={[
        styles.banner,
        {
          backgroundColor: config.bg,
          borderBottomColor: config.border,
        },
      ]}
    >
      <Text style={styles.emoji}>{config.emoji}</Text>
      <Text style={[styles.text, { color: config.fg }]}>{config.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
  },
  emoji: {
    fontSize: 14,
  },
  text: {
    fontSize: typography.sm,
    fontWeight: typography.semibold,
    letterSpacing: 0.2,
  },
});
