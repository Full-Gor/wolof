import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  FlatList,
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, fontSizes, borderRadius, shadows } from '../utils/theme';
import { LANGUAGES } from '../context/AppContext';

export default function LanguageSelector({
  selectedLang,
  onSelect,
  excludeLang,
  label,
}) {
  const [modalVisible, setModalVisible] = useState(false);

  const availableLanguages = LANGUAGES.filter((lang) => lang.code !== excludeLang);
  const selectedLanguage = LANGUAGES.find((lang) => lang.code === selectedLang);

  const handleSelect = (langCode) => {
    onSelect(langCode);
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TouchableOpacity
        style={styles.selector}
        onPress={() => setModalVisible(true)}
        activeOpacity={0.7}
      >
        <Text style={styles.flag}>{selectedLanguage?.flag}</Text>
        <Text style={styles.langName}>{selectedLanguage?.name}</Text>
        <Ionicons name="chevron-down" size={20} color={colors.gray} />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <SafeAreaView style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Choisir une langue</Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={24} color={colors.black} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={availableLanguages}
              keyExtractor={(item) => item.code}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.langItem,
                    item.code === selectedLang && styles.langItemSelected,
                  ]}
                  onPress={() => handleSelect(item.code)}
                >
                  <Text style={styles.langItemFlag}>{item.flag}</Text>
                  <View style={styles.langItemText}>
                    <Text style={styles.langItemName}>{item.name}</Text>
                    <Text style={styles.langItemNative}>{item.nativeName}</Text>
                  </View>
                  {item.code === selectedLang && (
                    <Ionicons name="checkmark-circle" size={24} color={colors.green} />
                  )}
                </TouchableOpacity>
              )}
            />
          </SafeAreaView>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  label: {
    fontSize: fontSizes.sm,
    color: colors.gray,
    marginBottom: spacing.xs,
  },
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    ...shadows.sm,
  },
  flag: {
    fontSize: fontSizes.xl,
    marginRight: spacing.sm,
  },
  langName: {
    flex: 1,
    fontSize: fontSizes.md,
    fontWeight: '600',
    color: colors.black,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: colors.white,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.grayLight,
  },
  modalTitle: {
    fontSize: fontSizes.xl,
    fontWeight: 'bold',
    color: colors.black,
  },
  closeButton: {
    padding: spacing.xs,
  },
  langItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.grayLight,
  },
  langItemSelected: {
    backgroundColor: colors.green + '10',
  },
  langItemFlag: {
    fontSize: fontSizes.xxl,
    marginRight: spacing.md,
  },
  langItemText: {
    flex: 1,
  },
  langItemName: {
    fontSize: fontSizes.lg,
    fontWeight: '600',
    color: colors.black,
  },
  langItemNative: {
    fontSize: fontSizes.sm,
    color: colors.gray,
  },
});
