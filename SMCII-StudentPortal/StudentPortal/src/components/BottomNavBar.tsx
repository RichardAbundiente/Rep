import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { colors, spacing, radius } from '../theme/theme';

const TABS: { key: string; label: string; icon: string }[] = [
  { key: 'Home', label: 'Home', icon: '⌂' },
  { key: 'About', label: 'About', icon: 'ℹ' },
  { key: 'Contact', label: 'Contact', icon: '✉' },
  { key: 'Profile', label: 'Profile', icon: '☺' },
];

export default function BottomNavBar() {
  const navigation = useNavigation<any>();
  const route = useRoute();

  return (
    <View style={styles.bar}>
      {TABS.map(tab => {
        const active = route.name === tab.key;
        return (
          <TouchableOpacity
            key={tab.key}
            activeOpacity={0.7}
            onPress={() => {
              if (!active) {
                navigation.navigate(tab.key);
              }
            }}
            style={styles.tab}>
            <Text style={[styles.icon, active && styles.iconActive]}>{tab.icon}</Text>
            <Text style={[styles.label, active && styles.labelActive]}>{tab.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingVertical: spacing.sm,
    paddingBottom: spacing.md,
  },
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.pill,
    minWidth: 64,
  },
  icon: {
    fontSize: 18,
    color: colors.textMuted,
  },
  iconActive: {
    color: colors.primary,
  },
  label: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 2,
    fontWeight: '500',
  },
  labelActive: {
    color: colors.primary,
    fontWeight: '700',
  },
});
