import { useCallback, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

interface ChatInputProps {
  onSend: (content: string) => void;
  disabled: boolean;
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [text, setText] = useState("");

  const handleSend = useCallback(() => {
    const trimmed = text.trim();
    if (trimmed.length === 0) {
      return;
    }
    onSend(trimmed);
    setText("");
  }, [text, onSend]);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={text}
        onChangeText={setText}
        placeholder="Ask Nurse Bubbles..."
        placeholderTextColor="#999"
        multiline
        editable={!disabled}
        onSubmitEditing={handleSend}
        blurOnSubmit
      />
      <Pressable
        style={[styles.sendButton, disabled ? styles.sendDisabled : null]}
        onPress={handleSend}
        disabled={disabled || text.trim().length === 0}
      >
        <Text style={styles.sendText}>Send</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#E0E0E0",
    backgroundColor: "#FFF",
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    borderRadius: 20,
    borderCurve: "continuous",
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 15,
    color: "#333",
  },
  sendButton: {
    backgroundColor: "#00897B",
    borderRadius: 20,
    borderCurve: "continuous",
    paddingHorizontal: 18,
    paddingVertical: 10,
  },
  sendDisabled: {
    opacity: 0.5,
  },
  sendText: {
    color: "#FFF",
    fontWeight: "600",
    fontSize: 15,
  },
});
