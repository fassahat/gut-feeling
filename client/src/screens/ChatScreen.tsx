import { useCallback, useRef } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { FlashList, type FlashListRef } from "@shopify/flash-list";
import { useChat } from "../context/ChatContext";
import { ChatInput } from "../components/ChatInput";
import { ConnectionStatusBanner } from "../components/ConnectionStatusBanner";
import { MessageBubble } from "../components/MessageBubble";
import { TypingIndicator } from "../components/TypingIndicator";
import { UserSwitcher } from "../components/UserSwitcher";
import { palette, typography, spacing } from "../theme";
import type { Message } from "../types";

export function ChatScreen() {
  const { state, actions } = useChat();
  const listRef = useRef<FlashListRef<Message>>(null);

  const renderItem = useCallback(
    ({ item }: { item: Message }) => (
      <MessageBubble
        content={item.content}
        sender={item.sender}
        timestamp={item.created_at}
      />
    ),
    []
  );

  const keyExtractor = useCallback((item: Message) => item.id, []);

  const handleContentSizeChange = useCallback(() => {
    if (state.messages.length > 0) {
      listRef.current?.scrollToEnd({ animated: true });
    }
  }, [state.messages.length]);

  const isDisconnected = state.status !== "connected";

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      {/* Header — apothecary jar label feel */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.headerEmoji}>🫧</Text>
          <View style={styles.headerText}>
            <Text style={styles.title}>Nurse Bubbles</Text>
            <Text style={styles.subtitle}>
              your bubbly gut health companion
            </Text>
          </View>
        </View>
        <View style={styles.headerAccent} />
      </View>

      <ConnectionStatusBanner status={state.status} />
      <UserSwitcher
        currentUser={state.currentUser}
        onSwitch={actions.switchUser}
      />

      <View style={styles.listContainer}>
        <FlashList
          ref={listRef}
          data={state.messages}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          onContentSizeChange={handleContentSizeChange}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Text style={styles.emptyEmoji}>🍵</Text>
              <Text style={styles.emptyTitle}>The jar is quiet...</Text>
              <Text style={styles.emptyText}>
                Say hi to Nurse Bubbles! She's fizzing with excitement to chat
                about your gut health journey.
              </Text>
            </View>
          }
          ListFooterComponent={
            state.isTyping ? <TypingIndicator /> : null
          }
        />
      </View>

      <ChatInput onSend={actions.send} disabled={isDisconnected} />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.cream,
  },
  header: {
    backgroundColor: palette.amber800,
    paddingTop: 52,
    paddingBottom: 14,
    paddingHorizontal: spacing.lg,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  headerEmoji: {
    fontSize: 32,
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: typography.lg,
    fontWeight: typography.bold,
    color: palette.amber100,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: typography.sm,
    fontWeight: typography.medium,
    color: palette.amber200,
    marginTop: 1,
    fontStyle: "italic",
  },
  headerAccent: {
    height: 3,
    backgroundColor: palette.amber400,
    borderRadius: 2,
    marginTop: spacing.md,
    opacity: 0.5,
  },
  listContainer: {
    flex: 1,
  },
  listContent: {
    paddingVertical: spacing.md,
  },
  empty: {
    alignItems: "center",
    paddingHorizontal: 48,
    paddingTop: 80,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: spacing.lg,
  },
  emptyTitle: {
    fontSize: typography.md,
    fontWeight: typography.semibold,
    color: palette.bark,
    marginBottom: spacing.sm,
  },
  emptyText: {
    fontSize: typography.base,
    color: palette.amber600,
    textAlign: "center",
    lineHeight: 22,
  },
});
