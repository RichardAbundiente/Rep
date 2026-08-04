import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import GradientHeader from '../components/GradientHeader';
import BottomNavBar from '../components/BottomNavBar';
import Card from '../components/Card';
import FadeInView from '../components/FadeInView';
import { colors, spacing, radius } from '../theme/theme';

const QUICK_LINKS: { key: string; label: string; icon: string; desc: string }[] = [
  { key: 'About', label: 'About', icon: 'ℹ', desc: 'Learn about the app & school' },
  { key: 'Contact', label: 'Contact', icon: 'C', desc: 'Reach the school offices' },
  { key: 'Profile', label: 'Profile', icon: 'P', desc: 'View your student profile' },
];

export default function HomeScreen() {
  const navigation = useNavigation<any>();

  return (
    <View style={styles.screen}>
      <GradientHeader
        title="Student Portal"
        subtitle="Saint Michael's College of Iligan Inc."
      />
      <ScrollView
        style={styles.body}
        contentContainerStyle={styles.bodyContent}
        showsVerticalScrollIndicator={false}>
        <FadeInView delay={80}>
          <Card style={styles.welcomeCard}>
            <Text style={styles.welcomeTitle}>Welcome back</Text>
            <Text style={styles.welcomeText}>
              Use this portal to view your profile, learn more about SMCII, and get
              in touch with the school whenever you need to.
            </Text>
          </Card>
        </FadeInView>

        <Text style={styles.sectionLabel}>Quick Access</Text>

        <View style={styles.grid}>
          {QUICK_LINKS.map((item, index) => (
            <FadeInView key={item.key} delay={150 + index * 90} style={styles.gridItemWrap}>
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => navigation.navigate(item.key)}
                style={styles.gridItem}>
                <Text style={styles.gridIcon}>{item.icon}</Text>
                <Text style={styles.gridLabel}>{item.label}</Text>
                <Text style={styles.gridDesc}>{item.desc}</Text>
              </TouchableOpacity>
            </FadeInView>
          ))}
        </View>
      </ScrollView>
      <BottomNavBar />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.offWhite,
  },
  body: {
    flex: 1,
  },
  bodyContent: {
    padding: spacing.lg,
    paddingBottom: spacing.xl,
  },
  welcomeCard: {
    marginBottom: spacing.lg,
  },
  welcomeTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textDark,
    marginBottom: spacing.xs,
  },
  welcomeText: {
    fontSize: 14,
    color: colors.textMuted,
    lineHeight: 20,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: spacing.sm,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridItemWrap: {
    width: '48%',
    marginBottom: spacing.md,
  },
  gridItem: {
    backgroundColor: colors.white,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
    minHeight: 120,
    justifyContent: 'center',
  },
  gridIcon: {
    fontSize: 24,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  gridLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textDark,
    marginBottom: 2,
  },
  gridDesc: {
    fontSize: 12,
    color: colors.textMuted,
  },
});
