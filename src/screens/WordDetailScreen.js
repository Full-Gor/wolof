import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Share,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, fontSizes, borderRadius, shadows } from '../utils/theme';
import { useApp, LANGUAGES, getLanguageFlag } from '../context/AppContext';
import { getCategoryById } from '../utils/dictionary';

export default function WordDetailScreen({ route, navigation }) {
  const { entry } = route.params;
  const { actions } = useApp();
  const isFavorite = actions.isFavorite(entry.id);
  const category = getCategoryById(entry.category);

  const handleShare = async () => {
    try {
      const message = `📚 Wolof: ${entry.wolof}\n🔊 [${entry.phonetic}]\n\n🇫🇷 ${entry.translations.fr}\n🇬🇧 ${entry.translations.en}\n🇸🇦 ${entry.translations.ar}\n🇪🇸 ${entry.translations.es}\n\n— Wolof Translator App 🇸🇳`;
      await Share.share({ message });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.green} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.white} />
        </TouchableOpacity>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => actions.toggleFavorite(entry.id)}
          >
            <Ionicons
              name={isFavorite ? 'heart' : 'heart-outline'}
              size={24}
              color={isFavorite ? colors.red : colors.white}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
            <Ionicons name="share-outline" size={24} color={colors.white} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Main Word */}
        <View style={styles.mainWordContainer}>
          <Text style={styles.flag}>🇸🇳</Text>
          <Text style={styles.wolofWord}>{entry.wolof}</Text>
        </View>

        {/* Phonetic */}
        <View style={styles.phoneticContainer}>
          <MaterialCommunityIcons name="volume-high" size={24} color={colors.green} />
          <Text style={styles.phoneticText}>[{entry.phonetic}]</Text>
        </View>

        {/* Type Badge */}
        <View style={styles.badgeRow}>
          <View style={styles.typeBadge}>
            <Text style={styles.typeBadgeText}>
              {entry.type === 'word' ? 'Mot' : 'Expression'}
            </Text>
          </View>
          {category && (
            <View style={[styles.categoryBadge, { backgroundColor: category.color + '20' }]}>
              <Text style={[styles.categoryBadgeText, { color: category.color }]}>
                {category.name.fr}
              </Text>
            </View>
          )}
        </View>

        {/* Translations */}
        <View style={styles.translationsSection}>
          <Text style={styles.sectionTitle}>Traductions</Text>
          {LANGUAGES.filter((l) => l.code !== 'wo').map((lang) => (
            <View key={lang.code} style={styles.translationCard}>
              <View style={styles.translationHeader}>
                <Text style={styles.translationFlag}>{lang.flag}</Text>
                <Text style={styles.translationLang}>{lang.name}</Text>
              </View>
              <Text style={styles.translationText}>
                {entry.translations[lang.code]}
              </Text>
            </View>
          ))}
        </View>

        {/* Pronunciation Guide */}
        <View style={styles.pronunciationSection}>
          <Text style={styles.sectionTitle}>Guide de prononciation</Text>
          <View style={styles.pronunciationCard}>
            <View style={styles.pronunciationRow}>
              <MaterialCommunityIcons name="microphone" size={20} color={colors.green} />
              <Text style={styles.pronunciationLabel}>Phonétique:</Text>
            </View>
            <Text style={styles.pronunciationText}>{entry.phonetic}</Text>
            <Text style={styles.pronunciationHint}>
              Prononcez chaque syllabe séparément en suivant les tirets
            </Text>
          </View>
        </View>

        {/* Usage Tips */}
        <View style={styles.tipsSection}>
          <Text style={styles.sectionTitle}>Conseils d'utilisation</Text>
          <View style={styles.tipCard}>
            <MaterialCommunityIcons name="lightbulb-outline" size={24} color={colors.yellow} />
            <View style={styles.tipContent}>
              {entry.type === 'phrase' ? (
                <Text style={styles.tipText}>
                  Cette expression est couramment utilisée dans les conversations
                  quotidiennes au Sénégal. N'hésitez pas à la pratiquer!
                </Text>
              ) : (
                <Text style={styles.tipText}>
                  Ce mot peut être utilisé dans différents contextes. La pratique
                  régulière vous aidera à le mémoriser.
                </Text>
              )}
            </View>
          </View>
        </View>

        {/* Related Category */}
        {category && (
          <TouchableOpacity
            style={styles.categorySection}
            onPress={() => navigation.navigate('CategoryDetail', { category })}
          >
            <View style={[styles.categoryIcon, { backgroundColor: category.color + '20' }]}>
              <Ionicons name="folder-open" size={24} color={category.color} />
            </View>
            <View style={styles.categoryInfo}>
              <Text style={styles.categoryLabel}>Catégorie</Text>
              <Text style={styles.categoryName}>{category.name.fr}</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color={colors.gray} />
          </TouchableOpacity>
        )}

        <View style={styles.bottomSpace} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.green,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.lg,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backButton: {
    padding: spacing.xs,
  },
  headerActions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: spacing.sm,
    marginLeft: spacing.sm,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: spacing.md,
  },
  mainWordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    ...shadows.md,
  },
  flag: {
    fontSize: 40,
    marginRight: spacing.md,
  },
  wolofWord: {
    fontSize: fontSizes.xxxl,
    fontWeight: 'bold',
    color: colors.green,
    flex: 1,
  },
  phoneticContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.green + '10',
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    marginTop: spacing.md,
  },
  phoneticText: {
    fontSize: fontSizes.xl,
    color: colors.green,
    marginLeft: spacing.sm,
    fontStyle: 'italic',
  },
  badgeRow: {
    flexDirection: 'row',
    marginTop: spacing.md,
  },
  typeBadge: {
    backgroundColor: colors.grayLight,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    marginRight: spacing.sm,
  },
  typeBadgeText: {
    fontSize: fontSizes.sm,
    color: colors.grayDark,
    fontWeight: '600',
  },
  categoryBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
  },
  categoryBadgeText: {
    fontSize: fontSizes.sm,
    fontWeight: '600',
  },
  translationsSection: {
    marginTop: spacing.lg,
  },
  sectionTitle: {
    fontSize: fontSizes.lg,
    fontWeight: 'bold',
    color: colors.black,
    marginBottom: spacing.md,
  },
  translationCard: {
    backgroundColor: colors.white,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.sm,
    ...shadows.sm,
  },
  translationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  translationFlag: {
    fontSize: fontSizes.xl,
    marginRight: spacing.sm,
  },
  translationLang: {
    fontSize: fontSizes.sm,
    color: colors.gray,
    fontWeight: '600',
  },
  translationText: {
    fontSize: fontSizes.lg,
    color: colors.black,
  },
  pronunciationSection: {
    marginTop: spacing.lg,
  },
  pronunciationCard: {
    backgroundColor: colors.white,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    ...shadows.sm,
  },
  pronunciationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  pronunciationLabel: {
    fontSize: fontSizes.md,
    color: colors.gray,
    marginLeft: spacing.sm,
  },
  pronunciationText: {
    fontSize: fontSizes.xl,
    color: colors.green,
    fontWeight: '600',
    letterSpacing: 2,
  },
  pronunciationHint: {
    fontSize: fontSizes.sm,
    color: colors.gray,
    fontStyle: 'italic',
    marginTop: spacing.sm,
  },
  tipsSection: {
    marginTop: spacing.lg,
  },
  tipCard: {
    flexDirection: 'row',
    backgroundColor: colors.yellow + '20',
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    borderLeftWidth: 4,
    borderLeftColor: colors.yellow,
  },
  tipContent: {
    flex: 1,
    marginLeft: spacing.md,
  },
  tipText: {
    fontSize: fontSizes.md,
    color: colors.grayDark,
    lineHeight: 22,
  },
  categorySection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    marginTop: spacing.lg,
    ...shadows.sm,
  },
  categoryIcon: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  categoryLabel: {
    fontSize: fontSizes.sm,
    color: colors.gray,
  },
  categoryName: {
    fontSize: fontSizes.md,
    fontWeight: '600',
    color: colors.black,
  },
  bottomSpace: {
    height: spacing.xxl,
  },
});
