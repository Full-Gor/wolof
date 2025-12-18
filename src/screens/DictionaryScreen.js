import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, fontSizes, borderRadius } from '../utils/theme';
import { useApp } from '../context/AppContext';
import { searchEntries, getAllEntries } from '../utils/dictionary';
import SearchBar from '../components/SearchBar';
import WordCard from '../components/WordCard';

export default function DictionaryScreen({ navigation }) {
  const { state } = useApp();
  const [searchQuery, setSearchQuery] = useState('');

  const entries = searchQuery.trim().length > 0
    ? searchEntries(searchQuery, state.sourceLang, state.targetLang)
    : getAllEntries();

  const handleWordPress = useCallback((entry) => {
    navigation.navigate('WordDetail', { entry });
  }, [navigation]);

  const renderItem = useCallback(({ item }) => (
    <WordCard
      entry={item}
      targetLang={state.targetLang}
      onPress={() => handleWordPress(item)}
      compact
    />
  ), [state.targetLang, handleWordPress]);

  const keyExtractor = useCallback((item) => item.id, []);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.green} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Dictionnaire</Text>
        <Text style={styles.headerSubtitle}>{entries.length} mots et expressions</Text>
      </View>

      {/* Search Bar */}
      <SearchBar
        value={searchQuery}
        onChangeText={setSearchQuery}
        placeholder="Rechercher un mot..."
        onClear={() => setSearchQuery('')}
      />

      {/* Results */}
      {entries.length > 0 ? (
        <FlatList
          data={entries}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          initialNumToRender={15}
          maxToRenderPerBatch={10}
          windowSize={5}
        />
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>🔍</Text>
          <Text style={styles.emptyTitle}>Aucun résultat</Text>
          <Text style={styles.emptyText}>
            Essayez avec un autre terme de recherche
          </Text>
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
    backgroundColor: colors.green,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.lg,
    borderBottomLeftRadius: borderRadius.xl,
    borderBottomRightRadius: borderRadius.xl,
  },
  headerTitle: {
    fontSize: fontSizes.xxl,
    fontWeight: 'bold',
    color: colors.white,
  },
  headerSubtitle: {
    fontSize: fontSizes.md,
    color: colors.white,
    opacity: 0.9,
    marginTop: spacing.xs,
  },
  listContent: {
    paddingBottom: spacing.xxl,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: spacing.md,
  },
  emptyTitle: {
    fontSize: fontSizes.xl,
    fontWeight: 'bold',
    color: colors.black,
    marginBottom: spacing.sm,
  },
  emptyText: {
    fontSize: fontSizes.md,
    color: colors.gray,
    textAlign: 'center',
  },
});
