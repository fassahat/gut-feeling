import { useCallback, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { palette, typography, spacing, radii } from "../theme";

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

  const isEmpty = text.trim().length === 0;

  return (
    <View style={styles.container}>
      <View style={styles.inputWrapper}>
        <TextInput
          style={styles.input}
          value={text}
          onChangeText={setText}
          placeholder="Ask about your gut health..."
          placeholderTextColor={palette.amber400}
          multiline
          editable={!disabled}
          onSubmitEditing={handleSend}
          blurOnSubmit
        />
      </View>
      <Pressable
        style={[
          styles.sendButton,
          disabled || isEmpty ? styles.sendDisabled : null,
        ]}
        onPress={handleSend}
        disabled={disabled || isEmpty}
      >
        <Text style={styles.sendText}>🫧</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: palette.parchment,
    borderTopWidth: 1,
    borderTopColor: palette.linen,
  },
  inputWrapper: {
    flex: 1,
    borderRadius: radii.xl,
    borderCurve: "continuous",
    backgroundColor: palette.cream,
    borderWidth: 1.5,
    borderColor: palette.linen,
    overflow: "hidden",
  },
  input: {
    minHeight: 42,
    maxHeight: 100,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    fontSize: typography.base,
    color: palette.espresso,
    lineHeight: 20,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: palette.amber800,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: palette.amber800,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  sendDisabled: {
    backgroundColor: palette.linen,
    shadowOpacity: 0,
    elevation: 0,
  },
  sendText: {
    fontSize: 20,
  },
});
