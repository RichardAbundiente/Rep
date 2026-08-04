import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import GradientHeader from '../components/GradientHeader';
import BottomNavBar from '../components/BottomNavBar';
import Card from '../components/Card';
import FadeInView from '../components/FadeInView';
import { colors, spacing } from '../theme/theme';

export default function AboutScreen() {
  return (
    <View style={styles.screen}>
      <GradientHeader title="About" subtitle="Saint Michael's College of Iligan Inc." />
      <ScrollView
        style={styles.body}
        contentContainerStyle={styles.bodyContent}
        showsVerticalScrollIndicator={false}>
        <FadeInView delay={80}>
          <Card style={styles.card}>
            <Text style={styles.heading}>About the School</Text>
            <Text style={styles.paragraph}>
              Saint Michael's College of Iligan Inc. (SMCII) is
              committed to forming graduates who are competent, values-driven,
              and ready to serve their communities.
            </Text>
          </Card>
        </FadeInView>

        <FadeInView delay={160}>
          <Card style={styles.card}>
            <Text style={styles.heading}>About this App</Text>
            <Text style={styles.paragraph}>
              The Student Portal is a mobile companion app built
              with React Native. It demonstrates Flexbox layouts, the
              StyleSheet API, and Stack Navigation between multiple screens —
              Home, About, Contact, and Profile.
            </Text>
          </Card>
        </FadeInView>

        <FadeInView delay={240}>
          <Card style={styles.card}>
            <Text style={styles.heading}>Version</Text>
            <Text style={styles.paragraph}>App version 1.0.0 — built for CC400 / CS106.</Text>
          </Card>
        </FadeInView>
      </ScrollView>
      <BottomNavBar />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.offWhite },
  body: { flex: 1 },
  bodyContent: { padding: spacing.lg, paddingBottom: spacing.xl },
  card: { marginBottom: spacing.md },
  heading: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textDark,
    marginBottom: spacing.xs,
  },
  paragraph: {
    fontSize: 14,
    color: colors.textMuted,
    lineHeight: 20,
  },
});
