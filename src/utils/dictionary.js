import dictionaryData from '../data/dictionary.json';

// Get all entries
export function getAllEntries() {
  return dictionaryData.entries;
}

// Get all categories
export function getCategories() {
  return dictionaryData.categories;
}

// Get entry by ID
export function getEntryById(id) {
  return dictionaryData.entries.find((entry) => entry.id === id);
}

// Get entries by category
export function getEntriesByCategory(categoryId) {
  return dictionaryData.entries.filter((entry) => entry.category === categoryId);
}

// Get category by ID
export function getCategoryById(categoryId) {
  return dictionaryData.categories.find((cat) => cat.id === categoryId);
}

// Search entries
export function searchEntries(query, sourceLang = 'wo', targetLang = 'fr') {
  if (!query || query.trim().length === 0) {
    return [];
  }

  const normalizedQuery = query.toLowerCase().trim();

  return dictionaryData.entries.filter((entry) => {
    // Search in Wolof
    if (entry.wolof.toLowerCase().includes(normalizedQuery)) {
      return true;
    }

    // Search in phonetic
    if (entry.phonetic.toLowerCase().includes(normalizedQuery)) {
      return true;
    }

    // Search in all translations
    for (const langCode of Object.keys(entry.translations)) {
      if (entry.translations[langCode].toLowerCase().includes(normalizedQuery)) {
        return true;
      }
    }

    return false;
  });
}

// Translate text - finds best match in dictionary
export function translate(text, sourceLang, targetLang) {
  if (!text || text.trim().length === 0) {
    return { result: '', entry: null };
  }

  const normalizedText = text.toLowerCase().trim();

  // Find exact match first
  let match = dictionaryData.entries.find((entry) => {
    if (sourceLang === 'wo') {
      return entry.wolof.toLowerCase() === normalizedText;
    } else {
      return entry.translations[sourceLang]?.toLowerCase() === normalizedText;
    }
  });

  // If no exact match, find partial match
  if (!match) {
    match = dictionaryData.entries.find((entry) => {
      if (sourceLang === 'wo') {
        return entry.wolof.toLowerCase().includes(normalizedText);
      } else {
        return entry.translations[sourceLang]?.toLowerCase().includes(normalizedText);
      }
    });
  }

  if (match) {
    let result;
    if (targetLang === 'wo') {
      result = match.wolof;
    } else {
      result = match.translations[targetLang] || '';
    }
    return { result, entry: match };
  }

  return { result: '', entry: null };
}

// Get translation for a specific language
export function getTranslation(entry, langCode) {
  if (!entry) return '';
  if (langCode === 'wo') {
    return entry.wolof;
  }
  return entry.translations[langCode] || '';
}

// Get random word (for Word of the Day)
export function getRandomWord() {
  const entries = dictionaryData.entries;
  const randomIndex = Math.floor(Math.random() * entries.length);
  return entries[randomIndex];
}

// Get word of day based on date (consistent for the same day)
export function getWordOfDay(date = new Date()) {
  const entries = dictionaryData.entries;
  const dayOfYear = getDayOfYear(date);
  const index = dayOfYear % entries.length;
  return entries[index];
}

function getDayOfYear(date) {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date - start;
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
}

// Get entries by IDs (for favorites)
export function getEntriesByIds(ids) {
  return ids
    .map((id) => dictionaryData.entries.find((entry) => entry.id === id))
    .filter(Boolean);
}

// Get suggestions based on partial input
export function getSuggestions(text, sourceLang = 'wo', limit = 5) {
  if (!text || text.trim().length < 2) {
    return [];
  }

  const normalizedText = text.toLowerCase().trim();
  const results = [];

  for (const entry of dictionaryData.entries) {
    if (results.length >= limit) break;

    if (sourceLang === 'wo') {
      if (entry.wolof.toLowerCase().startsWith(normalizedText)) {
        results.push(entry);
      }
    } else {
      const translation = entry.translations[sourceLang];
      if (translation && translation.toLowerCase().startsWith(normalizedText)) {
        results.push(entry);
      }
    }
  }

  return results;
}

export default {
  getAllEntries,
  getCategories,
  getEntryById,
  getEntriesByCategory,
  getCategoryById,
  searchEntries,
  translate,
  getTranslation,
  getRandomWord,
  getWordOfDay,
  getEntriesByIds,
  getSuggestions,
};
