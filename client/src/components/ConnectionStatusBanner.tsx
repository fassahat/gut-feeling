import { StyleSheet, Text, View } from "react-native";
import type { ConnectionStatus } from "../types";

const STATUS_CONFIG: Record<
  ConnectionStatus,
  { label: string; bg: string; fg: string }
> = {
  connected: { label: "Connected", bg: "#4CAF50", fg: "#FFF" },
  connecting: { label: "Connecting...", bg: "#FF9800", fg: "#FFF" },
  disconnected: { label: "Disconnected", bg: "#F44336", fg: "#FFF" },
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
    <View style={[styles.banner, { backgroundColor: config.bg }]}>
      <Text style={[styles.text, { color: config.fg }]}>{config.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    paddingVertical: 6,
    alignItems: "center",
  },
  text: {
    fontSize: 13,
    fontWeight: "600",
  },
});
