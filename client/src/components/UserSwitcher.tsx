import { Pressable, StyleSheet, Text, View } from "react-native";
import { USERS, type UserId } from "../config";
import { palette, typography, spacing, radii } from "../theme";

const USER_DISPLAY: Record<UserId, { name: string; emoji: string }> = {
  "user-alice": { name: "Alice", emoji: "🌿" },
  "user-bob": { name: "Bob", emoji: "🍄" },
};

interface UserSwitcherProps {
  currentUser: UserId;
  onSwitch: (userId: UserId) => void;
  disabled?: boolean;
}

export function UserSwitcher({
  currentUser,
  onSwitch,
  disabled = false,
}: UserSwitcherProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>brewing as</Text>
      <View style={styles.pills}>
        {USERS.map((userId) => {
          const isActive = userId === currentUser;
          const display = USER_DISPLAY[userId];

          return (
            <Pressable
              key={userId}
              style={[
                styles.pill,
                isActive ? styles.pillActive : null,
                disabled ? styles.pillDisabled : null,
              ]}
              onPress={() => onSwitch(userId)}
              disabled={disabled}
              hitSlop={{ top: 8, bottom: 8, left: 4, right: 4 }}
              accessibilityRole="button"
              accessibilityLabel={`Switch to ${display.name}`}
              accessibilityState={{ selected: isActive, disabled }}
            >
              <Text style={styles.pillEmoji}>{display.emoji}</Text>
              <Text
                style={[
                  styles.pillText,
                  isActive ? styles.pillTextActive : null,
                ]}
              >
                {display.name}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    backgroundColor: palette.parchment,
    borderBottomWidth: 1,
    borderBottomColor: palette.linen,
  },
  label: {
    fontSize: typography.xs,
    fontWeight: typography.medium,
    color: palette.amber600,
    letterSpacing: 0.5,
    textTransform: "uppercase",
    fontStyle: "italic",
  },
  pills: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radii.full,
    borderCurve: "continuous",
    backgroundColor: palette.cream,
    borderWidth: 1.5,
    borderColor: palette.linen,
  },
  pillActive: {
    backgroundColor: palette.amber800,
    borderColor: palette.amber600,
  },
  pillDisabled: {
    opacity: 0.5,
  },
  pillEmoji: {
    fontSize: 14,
  },
  pillText: {
    fontSize: typography.sm,
    fontWeight: typography.semibold,
    color: palette.bark,
  },
  pillTextActive: {
    color: palette.amber100,
  },
});
