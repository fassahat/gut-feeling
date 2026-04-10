import { Pressable, StyleSheet, Text, View } from "react-native";
import { USERS, type UserId } from "../config";

interface UserSwitcherProps {
  currentUser: UserId;
  onSwitch: (userId: UserId) => void;
}

export function UserSwitcher({ currentUser, onSwitch }: UserSwitcherProps) {
  return (
    <View style={styles.container}>
      {USERS.map((userId) => {
        const isActive = userId === currentUser;
        const label = userId.replace("user-", "");

        return (
          <Pressable
            key={userId}
            style={[styles.button, isActive ? styles.buttonActive : null]}
            onPress={() => onSwitch(userId)}
          >
            <Text
              style={[styles.label, isActive ? styles.labelActive : null]}
            >
              {label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
    borderCurve: "continuous",
    backgroundColor: "#E0E0E0",
  },
  buttonActive: {
    backgroundColor: "#00897B",
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#555",
    textTransform: "capitalize",
  },
  labelActive: {
    color: "#FFF",
  },
});
