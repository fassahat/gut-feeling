import { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";
import { palette, spacing, radii } from "../theme";

const BUBBLE_COUNT = 3;
const BUBBLE_SIZES = [10, 7, 5];

export function TypingIndicator() {
  const anims = useRef(
    Array.from({ length: BUBBLE_COUNT }, () => new Animated.Value(0))
  ).current;

  const scaleAnims = useRef(
    Array.from({ length: BUBBLE_COUNT }, () => new Animated.Value(1))
  ).current;

  useEffect(() => {
    const animations = anims.map((anim, i) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(i * 250),
          Animated.parallel([
            Animated.timing(anim, {
              toValue: 1,
              duration: 500,
              useNativeDriver: true,
            }),
            Animated.timing(scaleAnims[i], {
              toValue: 1.3,
              duration: 500,
              useNativeDriver: true,
            }),
          ]),
          Animated.parallel([
            Animated.timing(anim, {
              toValue: 0,
              duration: 500,
              useNativeDriver: true,
            }),
            Animated.timing(scaleAnims[i], {
              toValue: 0.8,
              duration: 500,
              useNativeDriver: true,
            }),
          ]),
        ])
      )
    );

    Animated.parallel(animations).start();

    return () => {
      animations.forEach((a) => a.stop());
    };
  }, [anims, scaleAnims]);

  return (
    <View style={styles.row}>
      <View style={styles.avatar}>
        <Animated.Text
          style={[
            styles.avatarText,
            {
              transform: [
                {
                  scale: scaleAnims[0].interpolate({
                    inputRange: [0.8, 1.3],
                    outputRange: [0.95, 1.05],
                  }),
                },
              ],
            },
          ]}
        >
          🫧
        </Animated.Text>
      </View>
      <View style={styles.bubble}>
        <View style={styles.dots}>
          {anims.map((anim, i) => (
            <Animated.View
              key={i}
              style={[
                styles.dot,
                {
                  width: BUBBLE_SIZES[i],
                  height: BUBBLE_SIZES[i],
                  borderRadius: BUBBLE_SIZES[i] / 2,
                  opacity: anim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.35, 1],
                  }),
                  transform: [
                    {
                      translateY: anim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, -8],
                      }),
                    },
                    { scale: scaleAnims[i] },
                  ],
                },
              ]}
            />
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    paddingHorizontal: spacing.lg,
    alignItems: "flex-end",
    gap: spacing.sm,
    marginBottom: spacing.md,
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
  },
  avatarText: {
    fontSize: 18,
  },
  bubble: {
    backgroundColor: palette.white,
    borderRadius: radii.lg,
    borderTopLeftRadius: radii.sm,
    borderWidth: 1,
    borderColor: palette.linen,
    borderCurve: "continuous",
    paddingHorizontal: 20,
    paddingVertical: 14,
    shadowColor: palette.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 2,
  },
  dots: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  dot: {
    backgroundColor: palette.amber400,
  },
});
