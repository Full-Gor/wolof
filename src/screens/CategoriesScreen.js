import React from 'react';
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
import { getCategories } from '../utils/dictionary';
import CategoryCard from '../components/CategoryCard';

export default function CategoriesScreen({ navigation }) {
  const { state } = useApp();
  const categories = getCategories();

  const handleCategoryPress = (category) => {
    navigation.navigate('CategoryDetail', { category });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.green} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Catégories</Text>
        <Text style={styles.headerSubtitle}>
          Explorez le vocabulaire par thème
        </Text>
      </View>

      {/* Categories List */}
      <FlatList
        data={categories}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <CategoryCard
            category={item}
            targetLang={state.targetLang}
            onPress={() => handleCategoryPress(item)}
          />
        )}
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
    paddingTop: spacing.sm,
    paddingBottom: spacing.xxl,
  },
});
