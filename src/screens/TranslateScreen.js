import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar,
  Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors, spacing, fontSizes, borderRadius, shadows } from '../utils/theme';
import { useApp, LANGUAGES, getLanguageFlag, getLanguageName } from '../context/AppContext';
import { translate, getSuggestions, getTranslation } from '../utils/dictionary';
import LanguageSelector from '../components/LanguageSelector';
import WordCard from '../components/WordCard';

export default function TranslateScreen({ navigation }) {
  const { state, actions } = useApp();
  const [inputText, setInputText] = useState('');
  const [translation, setTranslation] = useState('');
  const [matchedEntry, setMatchedEntry] = useState(null);
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    if (inputText.trim().length > 0) {
      const result = translate(inputText, state.sourceLang, state.targetLang);
      setTranslation(result.result);
      setMatchedEntry(result.entry);

      // Get suggestions
      const suggs = getSuggestions(inputText, state.sourceLang, 5);
      setSuggestions(suggs);

      // Add to history if we have a match
      if (result.entry) {
        actions.addToHistory(result.entry);
      }
    } else {
      setTranslation('');
      setMatchedEntry(null);
      setSuggestions([]);
    }
  }, [inputText, state.sourceLang, state.targetLang]);

  const handleSwapLanguages = () => {
    actions.swapLanguages();
    // Swap the input/output text if there's a match
    if (matchedEntry) {
      setInputText(translation);
    }
  };

  const handleClear = () => {
    setInputText('');
    setTranslation('');
    setMatchedEntry(null);
    setSuggestions([]);
  };

  const handleSuggestionPress = (entry) => {
    Keyboard.dismiss();
    if (state.sourceLang === 'wo') {
      setInputText(entry.wolof);
    } else {
      setInputText(entry.translations[state.sourceLang] || '');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={colors.green} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Traduction</Text>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
      >
        {/* Language Selectors */}
        <View style={styles.languageRow}>
          <LanguageSelector
            selectedLang={state.sourceLang}
            onSelect={actions.setSourceLang}
            excludeLang={state.targetLang}
            label="De"
          />
          <TouchableOpacity
            style={styles.swapButton}
            onPress={handleSwapLanguages}
            activeOpacity={0.7}
          >
            <MaterialCommunityIcons
              name="swap-horizontal"
              size={24}
              color={colors.white}
            />
          </TouchableOpacity>
          <LanguageSelector
            selectedLang={state.targetLang}
            onSelect={actions.setTargetLang}
            excludeLang={state.sourceLang}
            label="Vers"
          />
        </View>

        {/* Input Area */}
        <View style={styles.inputContainer}>
          <View style={styles.inputHeader}>
            <Text style={styles.inputFlag}>{getLanguageFlag(state.sourceLang)}</Text>
            <Text style={styles.inputLabel}>{getLanguageName(state.sourceLang)}</Text>
            {inputText.length > 0 && (
              <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
                <Ionicons name="close-circle" size={24} color={colors.gray} />
              </TouchableOpacity>
            )}
          </View>
          <TextInput
            style={styles.input}
            value={inputText}
            onChangeText={setInputText}
            placeholder={`Entrez du texte en ${getLanguageName(state.sourceLang)}...`}
            placeholderTextColor={colors.gray}
            multiline
            textAlignVertical="top"
          />
        </View>

        {/* Suggestions */}
        {suggestions.length > 0 && inputText.length > 0 && !matchedEntry && (
          <View style={styles.suggestionsContainer}>
            <Text style={styles.suggestionsTitle}>Suggestions:</Text>
            {suggestions.map((entry) => (
              <TouchableOpacity
                key={entry.id}
                style={styles.suggestionItem}
                onPress={() => handleSuggestionPress(entry)}
              >
                <Text style={styles.suggestionWolof}>
                  {state.sourceLang === 'wo'
                    ? entry.wolof
                    : entry.translations[state.sourceLang]}
                </Text>
                <Ionicons name="arrow-forward" size={16} color={colors.gray} />
                <Text style={styles.suggestionTranslation}>
                  {state.targetLang === 'wo'
                    ? entry.wolof
                    : entry.translations[state.targetLang]}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Translation Output */}
        <View style={styles.outputContainer}>
          <View style={styles.outputHeader}>
            <Text style={styles.outputFlag}>{getLanguageFlag(state.targetLang)}</Text>
            <Text style={styles.outputLabel}>{getLanguageName(state.targetLang)}</Text>
            {matchedEntry && (
              <TouchableOpacity
                onPress={() => actions.toggleFavorite(matchedEntry.id)}
                style={styles.favoriteButton}
              >
                <Ionicons
                  name={
                    actions.isFavorite(matchedEntry.id) ? 'heart' : 'heart-outline'
                  }
                  size={24}
                  color={
                    actions.isFavorite(matchedEntry.id) ? colors.red : colors.gray
                  }
                />
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.output}>
            {translation ? (
              <Text style={styles.outputText}>{translation}</Text>
            ) : inputText.length > 0 ? (
              <Text style={styles.noResultText}>
                Traduction non trouvée dans le dictionnaire
              </Text>
            ) : (
              <Text style={styles.placeholderText}>La traduction apparaîtra ici</Text>
            )}
          </View>
        </View>

        {/* Matched Entry Details */}
        {matchedEntry && (
          <View style={styles.entryDetails}>
            <View style={styles.phoneticRow}>
              <MaterialCommunityIcons
                name="volume-high"
                size={20}
                color={colors.green}
              />
              <Text style={styles.phoneticText}>[{matchedEntry.phonetic}]</Text>
            </View>

            <View style={styles.allTranslations}>
              <Text style={styles.translationsTitle}>Toutes les traductions:</Text>
              {LANGUAGES.filter((l) => l.code !== 'wo').map((lang) => (
                <View key={lang.code} style={styles.translationRow}>
                  <Text style={styles.translationFlag}>{lang.flag}</Text>
                  <Text style={styles.translationLang}>{lang.name}:</Text>
                  <Text style={styles.translationValue}>
                    {matchedEntry.translations[lang.code]}
                  </Text>
                </View>
              ))}
            </View>

            <TouchableOpacity
              style={styles.viewDetailButton}
              onPress={() =>
                navigation.navigate('WordDetail', { entry: matchedEntry })
              }
            >
              <Text style={styles.viewDetailText}>Voir plus de détails</Text>
              <Ionicons name="arrow-forward" size={16} color={colors.green} />
            </TouchableOpacity>
          </View>
        )}
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
  headerTitle: {
    fontSize: fontSizes.xxl,
    fontWeight: 'bold',
    color: colors.white,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: spacing.md,
  },
  languageRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: spacing.lg,
  },
  swapButton: {
    backgroundColor: colors.green,
    width: 44,
    height: 44,
    borderRadius: borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: spacing.sm,
    ...shadows.md,
  },
  inputContainer: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
    ...shadows.md,
  },
  inputHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.grayLight,
    paddingBottom: spacing.sm,
  },
  inputFlag: {
    fontSize: fontSizes.xl,
    marginRight: spacing.sm,
  },
  inputLabel: {
    flex: 1,
    fontSize: fontSizes.md,
    fontWeight: '600',
    color: colors.black,
  },
  clearButton: {
    padding: spacing.xs,
  },
  input: {
    padding: spacing.md,
    fontSize: fontSizes.lg,
    color: colors.black,
    minHeight: 100,
  },
  suggestionsContainer: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  suggestionsTitle: {
    fontSize: fontSizes.sm,
    color: colors.gray,
    marginBottom: spacing.sm,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.grayLight,
  },
  suggestionWolof: {
    flex: 1,
    fontSize: fontSizes.md,
    color: colors.green,
    fontWeight: '600',
  },
  suggestionTranslation: {
    flex: 1,
    fontSize: fontSizes.md,
    color: colors.black,
    marginLeft: spacing.sm,
  },
  outputContainer: {
    backgroundColor: colors.green + '10',
    borderRadius: borderRadius.lg,
    borderWidth: 2,
    borderColor: colors.green,
    marginBottom: spacing.md,
  },
  outputHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingTop: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.green + '30',
    paddingBottom: spacing.sm,
  },
  outputFlag: {
    fontSize: fontSizes.xl,
    marginRight: spacing.sm,
  },
  outputLabel: {
    flex: 1,
    fontSize: fontSizes.md,
    fontWeight: '600',
    color: colors.green,
  },
  favoriteButton: {
    padding: spacing.xs,
  },
  output: {
    padding: spacing.md,
    minHeight: 100,
  },
  outputText: {
    fontSize: fontSizes.lg,
    color: colors.black,
    fontWeight: '500',
  },
  noResultText: {
    fontSize: fontSizes.md,
    color: colors.gray,
    fontStyle: 'italic',
  },
  placeholderText: {
    fontSize: fontSizes.md,
    color: colors.gray,
  },
  entryDetails: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    ...shadows.md,
  },
  phoneticRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    padding: spacing.sm,
    backgroundColor: colors.green + '10',
    borderRadius: borderRadius.md,
  },
  phoneticText: {
    fontSize: fontSizes.lg,
    color: colors.green,
    marginLeft: spacing.sm,
    fontStyle: 'italic',
  },
  allTranslations: {
    marginBottom: spacing.md,
  },
  translationsTitle: {
    fontSize: fontSizes.sm,
    color: colors.gray,
    marginBottom: spacing.sm,
  },
  translationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.xs,
  },
  translationFlag: {
    fontSize: fontSizes.lg,
    marginRight: spacing.sm,
  },
  translationLang: {
    fontSize: fontSizes.sm,
    color: colors.gray,
    width: 80,
  },
  translationValue: {
    flex: 1,
    fontSize: fontSizes.md,
    color: colors.black,
  },
  viewDetailButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.grayLight,
    marginTop: spacing.sm,
  },
  viewDetailText: {
    fontSize: fontSizes.md,
    color: colors.green,
    fontWeight: '600',
    marginRight: spacing.xs,
  },
});
