import React, { useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, fontSizes, borderRadius } from '../utils/theme';
import { useApp } from '../context/AppContext';
import WordCard from '../components/WordCard';

export default function HistoryScreen({ navigation }) {
  const { state, actions } = useApp();

  const handleWordPress = useCallback((entry) => {
    navigation.navigate('WordDetail', { entry });
  }, [navigation]);

  const handleClearHistory = () => {
    Alert.alert(
      'Effacer l\'historique',
      'Voulez-vous vraiment effacer tout l\'historique ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Effacer',
          style: 'destructive',
          onPress: () => actions.clearHistory(),
        },
      ]
    );
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'À l\'instant';
    if (diffMins < 60) return `Il y a ${diffMins} min`;
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    if (diffDays < 7) return `Il y a ${diffDays}j`;
    return date.toLocaleDateString('fr-FR');
  };

  const renderItem = useCallback(({ item }) => (
    <View>
      <Text style={styles.timestamp}>{formatTimestamp(item.timestamp)}</Text>
      <WordCard
        entry={item}
        targetLang={state.targetLang}
        onPress={() => handleWordPress(item)}
        compact
      />
    </View>
  ), [state.targetLang, handleWordPress]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.yellow} />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Ionicons name="time" size={28} color={colors.black} />
          <Text style={styles.headerTitle}>Historique</Text>
        </View>
        {state.history.length > 0 && (
          <TouchableOpacity onPress={handleClearHistory} style={styles.clearButton}>
            <Ionicons name="trash-outline" size={20} color={colors.black} />
            <Text style={styles.clearText}>Effacer</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* History List */}
      {state.history.length > 0 ? (
        <FlatList
          data={state.history}
          keyExtractor={(item, index) => `${item.id}-${index}`}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyState}>
          <Ionicons name="time-outline" size={80} color={colors.grayLight} />
          <Text style={styles.emptyTitle}>Aucun historique</Text>
          <Text style={styles.emptyText}>
            Vos recherches et traductions apparaîtront ici
          </Text>
          <TouchableOpacity
            style={styles.translateButton}
            onPress={() => navigation.navigate('Translate')}
          >
            <Text style={styles.translateButtonText}>Commencer à traduire</Text>
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
    backgroundColor: colors.yellow,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.lg,
    borderBottomLeftRadius: borderRadius.xl,
    borderBottomRightRadius: borderRadius.xl,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: fontSizes.xxl,
    fontWeight: 'bold',
    color: colors.black,
    marginLeft: spacing.sm,
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.black + '20',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
  },
  clearText: {
    marginLeft: spacing.xs,
    color: colors.black,
    fontWeight: '600',
  },
  listContent: {
    paddingTop: spacing.sm,
    paddingBottom: spacing.xxl,
  },
  timestamp: {
    fontSize: fontSizes.xs,
    color: colors.gray,
    marginLeft: spacing.md,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
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
  translateButton: {
    marginTop: spacing.xl,
    backgroundColor: colors.yellow,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.full,
  },
  translateButtonText: {
    color: colors.black,
    fontWeight: 'bold',
    fontSize: fontSizes.md,
  },
});
