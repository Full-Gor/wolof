import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, fontSizes, borderRadius, shadows } from '../utils/theme';
import { useApp, getLanguageFlag } from '../context/AppContext';
import { getTranslation, getCategoryById } from '../utils/dictionary';

export default function WordCard({
  entry,
  targetLang = 'fr',
  showCategory = true,
  showPhonetic = true,
  onPress,
  compact = false,
}) {
  const { actions, state } = useApp();
  const isFavorite = actions.isFavorite(entry.id);
  const category = getCategoryById(entry.category);

  const handleFavoritePress = (e) => {
    e.stopPropagation();
    actions.toggleFavorite(entry.id);
  };

  if (compact) {
    return (
      <TouchableOpacity
        style={styles.compactContainer}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <View style={styles.compactContent}>
          <Text style={styles.compactWolof}>{entry.wolof}</Text>
          <Text style={styles.compactTranslation}>
            {getTranslation(entry, targetLang)}
          </Text>
        </View>
        <TouchableOpacity onPress={handleFavoritePress} style={styles.favoriteBtn}>
          <Ionicons
            name={isFavorite ? 'heart' : 'heart-outline'}
            size={20}
            color={isFavorite ? colors.red : colors.gray}
          />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.header}>
        <View style={styles.wolofContainer}>
          <Text style={styles.flag}>{getLanguageFlag('wo')}</Text>
          <Text style={styles.wolofText}>{entry.wolof}</Text>
        </View>
        <TouchableOpacity onPress={handleFavoritePress} style={styles.favoriteButton}>
          <Ionicons
            name={isFavorite ? 'heart' : 'heart-outline'}
            size={24}
            color={isFavorite ? colors.red : colors.gray}
          />
        </TouchableOpacity>
      </View>

      {showPhonetic && (
        <View style={styles.phoneticContainer}>
          <Ionicons name="volume-medium-outline" size={16} color={colors.gray} />
          <Text style={styles.phoneticText}>[{entry.phonetic}]</Text>
        </View>
      )}

      <View style={styles.translationContainer}>
        <Text style={styles.flag}>{getLanguageFlag(targetLang)}</Text>
        <Text style={styles.translationText}>
          {getTranslation(entry, targetLang)}
        </Text>
      </View>

      {showCategory && category && (
        <View style={[styles.categoryBadge, { backgroundColor: category.color + '20' }]}>
          <Text style={[styles.categoryText, { color: category.color }]}>
            {category.name[targetLang] || category.name.en}
          </Text>
        </View>
      )}

      <View style={styles.typeBadge}>
        <Text style={styles.typeText}>
          {entry.type === 'word' ? 'Mot' : 'Expression'}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginHorizontal: spacing.md,
    marginVertical: spacing.sm,
    ...shadows.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  wolofContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  flag: {
    fontSize: fontSizes.lg,
    marginRight: spacing.sm,
  },
  wolofText: {
    fontSize: fontSizes.xl,
    fontWeight: 'bold',
    color: colors.green,
    flex: 1,
  },
  favoriteButton: {
    padding: spacing.xs,
  },
  phoneticContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
    marginLeft: spacing.lg + spacing.sm,
  },
  phoneticText: {
    fontSize: fontSizes.md,
    color: colors.gray,
    marginLeft: spacing.xs,
    fontStyle: 'italic',
  },
  translationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.grayLight,
  },
  translationText: {
    fontSize: fontSizes.lg,
    color: colors.black,
    flex: 1,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    marginTop: spacing.md,
  },
  categoryText: {
    fontSize: fontSizes.sm,
    fontWeight: '600',
  },
  typeBadge: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.xl + spacing.md,
    backgroundColor: colors.grayLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  typeText: {
    fontSize: fontSizes.xs,
    color: colors.gray,
  },
  // Compact styles
  compactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.grayLight,
  },
  compactContent: {
    flex: 1,
  },
  compactWolof: {
    fontSize: fontSizes.md,
    fontWeight: '600',
    color: colors.green,
  },
  compactTranslation: {
    fontSize: fontSizes.sm,
    color: colors.gray,
    marginTop: 2,
  },
  favoriteBtn: {
    padding: spacing.sm,
  },
});
