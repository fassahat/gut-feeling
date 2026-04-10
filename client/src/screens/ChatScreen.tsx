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
      <View style={styles.header}>
        <Text style={styles.title}>Nurse Bubbles</Text>
        <Text style={styles.subtitle}>Your bubbly gut health companion</Text>
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
              <Text style={styles.emptyText}>
                Say hi to Nurse Bubbles! She's fizzing with excitement to chat
                about gut health.
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
    backgroundColor: "#FAFAFA",
  },
  header: {
    backgroundColor: "#00897B",
    paddingTop: 50,
    paddingBottom: 12,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFF",
  },
  subtitle: {
    fontSize: 13,
    color: "rgba(255,255,255,0.8)",
    marginTop: 2,
  },
  listContainer: {
    flex: 1,
  },
  listContent: {
    paddingVertical: 12,
  },
  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
    paddingTop: 60,
  },
  emptyText: {
    fontSize: 15,
    color: "#999",
    textAlign: "center",
    lineHeight: 22,
  },
});
