import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, fontSizes, borderRadius, shadows } from '../utils/theme';
import { useApp, getLanguageFlag } from '../context/AppContext';
import { getWordOfDay, getTranslation, getCategories } from '../utils/dictionary';
import WordCard from '../components/WordCard';

export default function HomeScreen({ navigation }) {
  const { state, actions } = useApp();
  const [wordOfDay, setWordOfDay] = useState(null);

  useEffect(() => {
    const wod = getWordOfDay();
    setWordOfDay(wod);
  }, []);

  const categories = getCategories().slice(0, 4);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.green} />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.flagStripe}>
            <View style={[styles.stripe, { backgroundColor: colors.green }]} />
            <View style={[styles.stripe, { backgroundColor: colors.yellow }]} />
            <View style={[styles.stripe, { backgroundColor: colors.red }]} />
          </View>
          <View>
            <Text style={styles.headerTitle}>Wolof</Text>
            <Text style={styles.headerSubtitle}>Traducteur & Dictionnaire</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Word of the Day */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons name="star-circle" size={24} color={colors.yellow} />
            <Text style={styles.sectionTitle}>Mot du jour</Text>
          </View>
          {wordOfDay && (
            <WordCard
              entry={wordOfDay}
              targetLang={state.targetLang}
              onPress={() => navigation.navigate('WordDetail', { entry: wordOfDay })}
            />
          )}
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={[styles.actionCard, { backgroundColor: colors.green }]}
            onPress={() => navigation.navigate('Translate')}
          >
            <Ionicons name="language" size={32} color={colors.white} />
            <Text style={styles.actionText}>Traduire</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionCard, { backgroundColor: colors.yellow }]}
            onPress={() => navigation.navigate('Dictionary')}
          >
            <Ionicons name="book" size={32} color={colors.black} />
            <Text style={[styles.actionText, { color: colors.black }]}>
              Dictionnaire
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionCard, { backgroundColor: colors.red }]}
            onPress={() => navigation.navigate('Categories')}
          >
            <Ionicons name="grid" size={32} color={colors.white} />
            <Text style={styles.actionText}>Catégories</Text>
          </TouchableOpacity>
        </View>

        {/* Categories Preview */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Ionicons name="folder-open" size={24} color={colors.green} />
            <Text style={styles.sectionTitle}>Catégories populaires</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Categories')}>
              <Text style={styles.seeAll}>Voir tout</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.categoriesGrid}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryItem,
                  { backgroundColor: category.color + '15' },
                ]}
                onPress={() =>
                  navigation.navigate('CategoryDetail', { category })
                }
              >
                <Text style={styles.categoryEmoji}>
                  {category.id === 'greetings' && '👋'}
                  {category.id === 'family' && '👨‍👩‍👧‍👦'}
                  {category.id === 'numbers' && '🔢'}
                  {category.id === 'food' && '🍽️'}
                </Text>
                <Text style={[styles.categoryName, { color: category.color }]}>
                  {category.name.wo}
                </Text>
                <Text style={styles.categoryTranslation}>
                  {category.name[state.targetLang] || category.name.fr}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Info Section */}
        <View style={styles.infoSection}>
          <MaterialCommunityIcons name="wifi-off" size={24} color={colors.green} />
          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>Mode hors-ligne</Text>
            <Text style={styles.infoText}>
              Cette application fonctionne entièrement hors-ligne. Aucune connexion
              internet n'est nécessaire.
            </Text>
          </View>
        </View>

        {/* Teranga Section */}
        <View style={styles.terangaSection}>
          <Text style={styles.terangaTitle}>🇸🇳 Teranga</Text>
          <Text style={styles.terangaText}>
            "Teranga" signifie hospitalité en Wolof. C'est une valeur fondamentale de
            la culture sénégalaise, représentant l'accueil chaleureux et la générosité
            envers les visiteurs.
          </Text>
        </View>

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
    borderBottomLeftRadius: borderRadius.xl,
    borderBottomRightRadius: borderRadius.xl,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flagStripe: {
    width: 8,
    height: 60,
    borderRadius: 4,
    overflow: 'hidden',
    marginRight: spacing.md,
  },
  stripe: {
    flex: 1,
  },
  headerTitle: {
    fontSize: fontSizes.xxxl,
    fontWeight: 'bold',
    color: colors.white,
  },
  headerSubtitle: {
    fontSize: fontSizes.md,
    color: colors.white,
    opacity: 0.9,
  },
  content: {
    flex: 1,
  },
  section: {
    marginTop: spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
  },
  sectionTitle: {
    fontSize: fontSizes.lg,
    fontWeight: 'bold',
    color: colors.black,
    marginLeft: spacing.sm,
    flex: 1,
  },
  seeAll: {
    fontSize: fontSizes.md,
    color: colors.green,
    fontWeight: '600',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    marginTop: spacing.lg,
  },
  actionCard: {
    flex: 1,
    aspectRatio: 1,
    marginHorizontal: spacing.xs,
    borderRadius: borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.md,
  },
  actionText: {
    color: colors.white,
    fontWeight: 'bold',
    marginTop: spacing.sm,
    fontSize: fontSizes.sm,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: spacing.md,
  },
  categoryItem: {
    width: '48%',
    marginHorizontal: '1%',
    marginVertical: spacing.xs,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    alignItems: 'center',
  },
  categoryEmoji: {
    fontSize: 32,
    marginBottom: spacing.xs,
  },
  categoryName: {
    fontSize: fontSizes.md,
    fontWeight: 'bold',
  },
  categoryTranslation: {
    fontSize: fontSizes.sm,
    color: colors.gray,
    marginTop: 2,
  },
  infoSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.green + '10',
    marginHorizontal: spacing.md,
    marginTop: spacing.lg,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
  },
  infoContent: {
    flex: 1,
    marginLeft: spacing.md,
  },
  infoTitle: {
    fontSize: fontSizes.md,
    fontWeight: 'bold',
    color: colors.green,
  },
  infoText: {
    fontSize: fontSizes.sm,
    color: colors.gray,
    marginTop: spacing.xs,
  },
  terangaSection: {
    backgroundColor: colors.yellow + '20',
    marginHorizontal: spacing.md,
    marginTop: spacing.lg,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    borderLeftWidth: 4,
    borderLeftColor: colors.yellow,
  },
  terangaTitle: {
    fontSize: fontSizes.lg,
    fontWeight: 'bold',
    color: colors.black,
    marginBottom: spacing.sm,
  },
  terangaText: {
    fontSize: fontSizes.md,
    color: colors.grayDark,
    lineHeight: 22,
  },
  bottomSpace: {
    height: spacing.xxl,
  },
});
