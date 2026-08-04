import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { colors, spacing, radius } from '../theme/theme';

type Props = {
  title: string;
  subtitle?: string;
};

export default function GradientHeader({ title, subtitle }: Props) {
  return (
    <LinearGradient
      colors={[colors.gradientStart, colors.gradientEnd]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}>
      <View style={styles.textWrap}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: spacing.xl + 12,
    paddingBottom: spacing.lg,
    paddingHorizontal: spacing.lg,
    borderBottomLeftRadius: radius.lg,
    borderBottomRightRadius: radius.lg,
  },
  textWrap: {
    flexDirection: 'column',
  },
  title: {
    color: colors.white,
    fontSize: 26,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  subtitle: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 14,
    marginTop: 4,
  },
});
