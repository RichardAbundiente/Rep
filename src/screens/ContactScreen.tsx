import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import GradientHeader from '../components/GradientHeader';
import BottomNavBar from '../components/BottomNavBar';
import Card from '../components/Card';
import FadeInView from '../components/FadeInView';
import { colors, spacing, radius } from '../theme/theme';

type ContactItem = {
  icon: string;
  label: string;
  value: string;
  action?: () => void;
};

export default function ContactScreen() {
  const items: ContactItem[] = [
    {
      icon: 'A',
      label: 'Address',
      value: '74, Manuel L. Quezon Ave, Iligan City, Lanao del Norte, Philippines',
    },
    {
      icon: 'P',
      label: 'Phone',
      value: '(063) 221-2810',
      action: () => Linking.openURL('tel:0632212801'),
    },
    {
      icon: 'E',
      label: 'Email',
      value: 'smciligan.edu.ph',
      action: () => Linking.openURL('mailto:smciligan.edu.ph'),
    },
    {
      icon: 'W',
      label: 'Website',
      value: 'https://smciligan.edu.ph/',
      action: () => Linking.openURL('https://smciligan.edu.ph/'),
    },
  ];

  return (
    <View style={styles.screen}>
      <GradientHeader title="Contact Us" subtitle="We're happy to help" />
      <ScrollView
        style={styles.body}
        contentContainerStyle={styles.bodyContent}
        showsVerticalScrollIndicator={false}>
        {items.map((item, index) => (
          <FadeInView key={item.label} delay={80 + index * 90}>
            <Card style={styles.card}>
              <TouchableOpacity
                activeOpacity={item.action ? 0.7 : 1}
                onPress={item.action}
                style={styles.row}>
                <View style={styles.iconWrap}>
                  <Text style={styles.icon}>{item.icon}</Text>
                </View>
                <View style={styles.textWrap}>
                  <Text style={styles.label}>{item.label}</Text>
                  <Text style={styles.value}>{item.value}</Text>
                </View>
              </TouchableOpacity>
            </Card>
          </FadeInView>
        ))}
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
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: colors.offWhite,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  icon: { fontSize: 20 },
  textWrap: { flex: 1 },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginBottom: 2,
  },
  value: {
    fontSize: 14,
    color: colors.textDark,
  },
});
