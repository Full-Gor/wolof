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
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, fontSizes, borderRadius } from '../utils/theme';
import { useApp } from '../context/AppContext';
import { getEntriesByCategory } from '../utils/dictionary';
import WordCard from '../components/WordCard';

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

export default function CategoryDetailScreen({ route, navigation }) {
  const { category } = route.params;
  const { state } = useApp();
  const entries = getEntriesByCategory(category.id);
  const icon = iconMap[category.icon] || 'folder';

  const handleWordPress = useCallback((entry) => {
    navigation.navigate('WordDetail', { entry });
  }, [navigation]);

  const renderItem = useCallback(({ item }) => (
    <WordCard
      entry={item}
      targetLang={state.targetLang}
      showCategory={false}
      onPress={() => handleWordPress(item)}
    />
  ), [state.targetLang, handleWordPress]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={category.color} />

      {/* Header */}
      <View style={[styles.header, { backgroundColor: category.color }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={colors.white} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons name={icon} size={40} color={category.color} />
          </View>
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>{category.name.wo}</Text>
            <Text style={styles.headerSubtitle}>
              {category.name[state.targetLang] || category.name.fr}
            </Text>
            <Text style={styles.count}>{entries.length} mots</Text>
          </View>
        </View>
      </View>

      {/* Entries List */}
      <FlatList
        data={entries}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.lg,
    borderBottomLeftRadius: borderRadius.xl,
    borderBottomRightRadius: borderRadius.xl,
  },
  backButton: {
    marginBottom: spacing.md,
    padding: spacing.xs,
    alignSelf: 'flex-start',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 70,
    height: 70,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontSize: fontSizes.xxl,
    fontWeight: 'bold',
    color: colors.white,
  },
  headerSubtitle: {
    fontSize: fontSizes.lg,
    color: colors.white,
    opacity: 0.9,
    marginTop: spacing.xs,
  },
  count: {
    fontSize: fontSizes.md,
    color: colors.white,
    opacity: 0.8,
    marginTop: spacing.xs,
  },
  listContent: {
    paddingTop: spacing.sm,
    paddingBottom: spacing.xxl,
  },
});
