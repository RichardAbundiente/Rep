import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import GradientHeader from '../components/GradientHeader';
import BottomNavBar from '../components/BottomNavBar';
import Card from '../components/Card';
import FadeInView from '../components/FadeInView';
import { colors, spacing, radius } from '../theme/theme';

const STUDENT = {
  name: 'Richard Allen G. Abundiente',
  course: 'BS Information Technology',
  yearBlock: '4th Year - Block B',
  studentId: 'C23-1040',
  school: "Saint Michael's College of Iligan Inc.",
  email: 'richardallengerona.abundiente@my.smciligan.edu.ph',
  skills: ['JavaScript', 'Python', 'C/C++', 'Embedded Systems', 'Web Development', 'Digital and Traditional Art'],
};

export default function ProfileScreen() {
  return (
    <View style={styles.screen}>
      <GradientHeader title="Profile" subtitle="Your student information" />
      <ScrollView
        style={styles.body}
        contentContainerStyle={styles.bodyContent}
        showsVerticalScrollIndicator={false}>
        <FadeInView delay={80}>
          <LinearGradient
            colors={[colors.gradientStart, colors.gradientEnd]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.avatarCard}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarInitials}>
                {STUDENT.name
                  .split(' ')
                  .map(n => n[0])
                  .join('')
                  .slice(0, 2)}
              </Text>
            </View>
            <Text style={styles.name}>{STUDENT.name}</Text>
            <Text style={styles.course}>{STUDENT.course}</Text>
            <Text style={styles.yearBlock}>{STUDENT.yearBlock}</Text>
          </LinearGradient>
        </FadeInView>

        <FadeInView delay={180}>
          <Card style={styles.card}>
            <InfoRow label="Student ID" value={STUDENT.studentId} />
            <InfoRow label="School" value={STUDENT.school} />
            <InfoRow label="Email" value={STUDENT.email} isLast />
          </Card>
        </FadeInView>

        <FadeInView delay={260}>
          <Card style={styles.card}>
            <Text style={styles.skillsHeading}>Skills</Text>
            <View style={styles.skillsWrap}>
              {STUDENT.skills.map(skill => (
                <View key={skill} style={styles.skillChip}>
                  <Text style={styles.skillText}>{skill}</Text>
                </View>
              ))}
            </View>
          </Card>
        </FadeInView>
      </ScrollView>
      <BottomNavBar />
    </View>
  );
}

function InfoRow({
  label,
  value,
  isLast,
}: {
  label: string;
  value: string;
  isLast?: boolean;
}) {
  return (
    <View style={[styles.infoRow, !isLast && styles.infoRowBorder]}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.offWhite },
  body: { flex: 1 },
  bodyContent: { padding: spacing.lg, paddingBottom: spacing.xl },
  avatarCard: {
    alignItems: 'center',
    borderRadius: radius.lg,
    paddingVertical: spacing.xl,
    marginBottom: spacing.lg,
  },
  avatarCircle: {
    width: 84,
    height: 84,
    borderRadius: 42,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderWidth: 2,
    borderColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  avatarInitials: {
    color: colors.white,
    fontSize: 28,
    fontWeight: '700',
  },
  name: {
    color: colors.white,
    fontSize: 20,
    fontWeight: '700',
  },
  course: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
    marginTop: 2,
  },
  yearBlock: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 13,
    marginTop: 2,
  },
  card: { marginBottom: spacing.md },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
  },
  infoRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  infoLabel: {
    fontSize: 13,
    color: colors.textMuted,
  },
  infoValue: {
    fontSize: 13,
    color: colors.textDark,
    fontWeight: '600',
    flexShrink: 1,
    textAlign: 'right',
  },
  skillsHeading: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textDark,
    marginBottom: spacing.sm,
  },
  skillsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  skillChip: {
    backgroundColor: colors.offWhite,
    borderRadius: radius.pill,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: spacing.xs,
    marginBottom: spacing.xs,
    borderWidth: 1,
    borderColor: colors.border,
  },
  skillText: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '600',
  },
});
