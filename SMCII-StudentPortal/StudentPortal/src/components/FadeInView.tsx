import React, { useEffect, useRef } from 'react';
import { Animated, ViewStyle, StyleProp } from 'react-native';

type Props = {
  children: React.ReactNode;
  delay?: number;
  style?: StyleProp<ViewStyle>;
};

/**
 * Simple, dependency-free fade + slide-up entrance animation.
 * Used to give screens and cards a smooth, polished feel.
 */
export default function FadeInView({ children, delay = 0, style }: Props) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(16)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 450,
        delay,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 450,
        delay,
        useNativeDriver: true,
      }),
    ]).start();
  }, [opacity, translateY, delay]);

  return (
    <Animated.View style={[style, { opacity, transform: [{ translateY }] }]}>
      {children}
    </Animated.View>
  );
}
