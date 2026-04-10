import { useEffect, useRef } from "react";
import { Animated, StyleSheet, View } from "react-native";

const DOT_COUNT = 3;
const DOT_SIZE = 8;

export function TypingIndicator() {
  const anims = useRef(
    Array.from({ length: DOT_COUNT }, () => new Animated.Value(0))
  ).current;

  useEffect(() => {
    const animations = anims.map((anim, i) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(i * 200),
          Animated.timing(anim, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(anim, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
          }),
        ])
      )
    );

    Animated.parallel(animations).start();

    return () => {
      animations.forEach((a) => a.stop());
    };
  }, [anims]);

  return (
    <View style={styles.row}>
      <View style={styles.bubble}>
        <View style={styles.dots}>
          {anims.map((anim, i) => (
            <Animated.View
              key={i}
              style={[
                styles.dot,
                {
                  transform: [
                    {
                      translateY: anim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, -6],
                      }),
                    },
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
    paddingHorizontal: 12,
    alignItems: "flex-start",
  },
  bubble: {
    backgroundColor: "#FFF3E0",
    borderRadius: 18,
    borderCurve: "continuous",
    borderBottomLeftRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  dots: {
    flexDirection: "row",
    gap: 6,
  },
  dot: {
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
    backgroundColor: "#BFA076",
  },
});
