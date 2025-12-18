import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, fontSizes, borderRadius, shadows } from '../utils/theme';
import { getEntriesByCategory } from '../utils/dictionary';

const iconMap = {
  'hand-wave': 'hand-wave',
  'account-group': 'account-group',
  numeric: 'numeric',
  food: 'food',
  'comment-quote': 'comment-quote',
  clock: 'clock-outline',
  human: 'human',
  tree: 'tree',
  airplane: 'airplane',
  run: 'run',
};

export default function CategoryCard({ category, targetLang = 'fr', onPress }) {
  const entries = getEntriesByCategory(category.id);
  const icon = iconMap[category.icon] || 'folder';

  return (
    <TouchableOpacity
      style={[styles.container, { borderLeftColor: category.color }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.iconContainer, { backgroundColor: category.color + '20' }]}>
        <MaterialCommunityIcons name={icon} size={28} color={category.color} />
      </View>
      <View style={styles.content}>
        <Text style={styles.wolofName}>{category.name.wo}</Text>
        <Text style={styles.translatedName}>
          {category.name[targetLang] || category.name.en}
        </Text>
        <Text style={styles.count}>{entries.length} mots</Text>
      </View>
      <MaterialCommunityIcons name="chevron-right" size={24} color={colors.gray} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginHorizontal: spacing.md,
    marginVertical: spacing.sm,
    borderLeftWidth: 4,
    ...shadows.sm,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  content: {
    flex: 1,
  },
  wolofName: {
    fontSize: fontSizes.lg,
    fontWeight: 'bold',
    color: colors.black,
  },
  translatedName: {
    fontSize: fontSizes.md,
    color: colors.gray,
    marginTop: 2,
  },
  count: {
    fontSize: fontSizes.sm,
    color: colors.green,
    marginTop: spacing.xs,
    fontWeight: '600',
  },
});
