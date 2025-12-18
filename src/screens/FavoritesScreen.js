import React, { useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, fontSizes, borderRadius } from '../utils/theme';
import { useApp } from '../context/AppContext';
import { getEntriesByIds } from '../utils/dictionary';
import WordCard from '../components/WordCard';

export default function FavoritesScreen({ navigation }) {
  const { state } = useApp();
  const favoriteEntries = getEntriesByIds(state.favorites);

  const handleWordPress = useCallback((entry) => {
    navigation.navigate('WordDetail', { entry });
  }, [navigation]);

  const renderItem = useCallback(({ item }) => (
    <WordCard
      entry={item}
      targetLang={state.targetLang}
      onPress={() => handleWordPress(item)}
    />
  ), [state.targetLang, handleWordPress]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.red} />

      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="heart" size={28} color={colors.white} />
        <Text style={styles.headerTitle}>Favoris</Text>
        {favoriteEntries.length > 0 && (
          <Text style={styles.headerCount}>{favoriteEntries.length}</Text>
        )}
      </View>

      {/* Favorites List */}
      {favoriteEntries.length > 0 ? (
        <FlatList
          data={favoriteEntries}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyState}>
          <Ionicons name="heart-outline" size={80} color={colors.grayLight} />
          <Text style={styles.emptyTitle}>Aucun favori</Text>
          <Text style={styles.emptyText}>
            Appuyez sur le cœur pour ajouter des mots à vos favoris
          </Text>
          <TouchableOpacity
            style={styles.exploreButton}
            onPress={() => navigation.navigate('Dictionary')}
          >
            <Text style={styles.exploreButtonText}>Explorer le dictionnaire</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.red,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.lg,
    borderBottomLeftRadius: borderRadius.xl,
    borderBottomRightRadius: borderRadius.xl,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: fontSizes.xxl,
    fontWeight: 'bold',
    color: colors.white,
    marginLeft: spacing.sm,
    flex: 1,
  },
  headerCount: {
    fontSize: fontSizes.lg,
    fontWeight: 'bold',
    color: colors.white,
    backgroundColor: colors.white + '30',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  listContent: {
    paddingTop: spacing.sm,
    paddingBottom: spacing.xxl,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  emptyTitle: {
    fontSize: fontSizes.xl,
    fontWeight: 'bold',
    color: colors.black,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  emptyText: {
    fontSize: fontSizes.md,
    color: colors.gray,
    textAlign: 'center',
    lineHeight: 22,
  },
  exploreButton: {
    marginTop: spacing.xl,
    backgroundColor: colors.red,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.full,
  },
  exploreButtonText: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: fontSizes.md,
  },
});
