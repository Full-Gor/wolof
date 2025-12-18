import React, { createContext, useContext, useReducer, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AppContext = createContext();

const STORAGE_KEYS = {
  FAVORITES: '@wolof_favorites',
  HISTORY: '@wolof_history',
  SOURCE_LANG: '@wolof_source_lang',
  TARGET_LANG: '@wolof_target_lang',
  WORD_OF_DAY_DATE: '@wolof_wod_date',
  WORD_OF_DAY_ID: '@wolof_wod_id',
};

const initialState = {
  favorites: [],
  history: [],
  sourceLang: 'wo', // Wolof
  targetLang: 'fr', // French
  wordOfDay: null,
  wordOfDayDate: null,
  isLoading: true,
};

const actionTypes = {
  SET_LOADING: 'SET_LOADING',
  LOAD_DATA: 'LOAD_DATA',
  ADD_FAVORITE: 'ADD_FAVORITE',
  REMOVE_FAVORITE: 'REMOVE_FAVORITE',
  ADD_TO_HISTORY: 'ADD_TO_HISTORY',
  CLEAR_HISTORY: 'CLEAR_HISTORY',
  SET_SOURCE_LANG: 'SET_SOURCE_LANG',
  SET_TARGET_LANG: 'SET_TARGET_LANG',
  SWAP_LANGUAGES: 'SWAP_LANGUAGES',
  SET_WORD_OF_DAY: 'SET_WORD_OF_DAY',
};

function appReducer(state, action) {
  switch (action.type) {
    case actionTypes.SET_LOADING:
      return { ...state, isLoading: action.payload };

    case actionTypes.LOAD_DATA:
      return { ...state, ...action.payload, isLoading: false };

    case actionTypes.ADD_FAVORITE:
      if (state.favorites.includes(action.payload)) {
        return state;
      }
      return { ...state, favorites: [...state.favorites, action.payload] };

    case actionTypes.REMOVE_FAVORITE:
      return {
        ...state,
        favorites: state.favorites.filter((id) => id !== action.payload),
      };

    case actionTypes.ADD_TO_HISTORY:
      const filteredHistory = state.history.filter(
        (item) => item.id !== action.payload.id
      );
      const newHistory = [action.payload, ...filteredHistory].slice(0, 100);
      return { ...state, history: newHistory };

    case actionTypes.CLEAR_HISTORY:
      return { ...state, history: [] };

    case actionTypes.SET_SOURCE_LANG:
      return { ...state, sourceLang: action.payload };

    case actionTypes.SET_TARGET_LANG:
      return { ...state, targetLang: action.payload };

    case actionTypes.SWAP_LANGUAGES:
      return {
        ...state,
        sourceLang: state.targetLang,
        targetLang: state.sourceLang,
      };

    case actionTypes.SET_WORD_OF_DAY:
      return {
        ...state,
        wordOfDay: action.payload.word,
        wordOfDayDate: action.payload.date,
      };

    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load data from AsyncStorage on mount
  useEffect(() => {
    loadStoredData();
  }, []);

  // Save favorites to AsyncStorage
  useEffect(() => {
    if (!state.isLoading) {
      AsyncStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(state.favorites));
    }
  }, [state.favorites, state.isLoading]);

  // Save history to AsyncStorage
  useEffect(() => {
    if (!state.isLoading) {
      AsyncStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(state.history));
    }
  }, [state.history, state.isLoading]);

  // Save language preferences
  useEffect(() => {
    if (!state.isLoading) {
      AsyncStorage.setItem(STORAGE_KEYS.SOURCE_LANG, state.sourceLang);
      AsyncStorage.setItem(STORAGE_KEYS.TARGET_LANG, state.targetLang);
    }
  }, [state.sourceLang, state.targetLang, state.isLoading]);

  async function loadStoredData() {
    try {
      const [favorites, history, sourceLang, targetLang, wodDate, wodId] =
        await Promise.all([
          AsyncStorage.getItem(STORAGE_KEYS.FAVORITES),
          AsyncStorage.getItem(STORAGE_KEYS.HISTORY),
          AsyncStorage.getItem(STORAGE_KEYS.SOURCE_LANG),
          AsyncStorage.getItem(STORAGE_KEYS.TARGET_LANG),
          AsyncStorage.getItem(STORAGE_KEYS.WORD_OF_DAY_DATE),
          AsyncStorage.getItem(STORAGE_KEYS.WORD_OF_DAY_ID),
        ]);

      dispatch({
        type: actionTypes.LOAD_DATA,
        payload: {
          favorites: favorites ? JSON.parse(favorites) : [],
          history: history ? JSON.parse(history) : [],
          sourceLang: sourceLang || 'wo',
          targetLang: targetLang || 'fr',
          wordOfDayDate: wodDate,
          wordOfDay: wodId,
        },
      });
    } catch (error) {
      console.error('Error loading data:', error);
      dispatch({ type: actionTypes.SET_LOADING, payload: false });
    }
  }

  const actions = {
    addFavorite: (id) => {
      dispatch({ type: actionTypes.ADD_FAVORITE, payload: id });
    },

    removeFavorite: (id) => {
      dispatch({ type: actionTypes.REMOVE_FAVORITE, payload: id });
    },

    toggleFavorite: (id) => {
      if (state.favorites.includes(id)) {
        dispatch({ type: actionTypes.REMOVE_FAVORITE, payload: id });
      } else {
        dispatch({ type: actionTypes.ADD_FAVORITE, payload: id });
      }
    },

    isFavorite: (id) => state.favorites.includes(id),

    addToHistory: (entry) => {
      const historyItem = {
        ...entry,
        timestamp: Date.now(),
      };
      dispatch({ type: actionTypes.ADD_TO_HISTORY, payload: historyItem });
    },

    clearHistory: () => {
      dispatch({ type: actionTypes.CLEAR_HISTORY });
    },

    setSourceLang: (lang) => {
      dispatch({ type: actionTypes.SET_SOURCE_LANG, payload: lang });
    },

    setTargetLang: (lang) => {
      dispatch({ type: actionTypes.SET_TARGET_LANG, payload: lang });
    },

    swapLanguages: () => {
      dispatch({ type: actionTypes.SWAP_LANGUAGES });
    },

    setWordOfDay: async (wordId) => {
      const today = new Date().toDateString();
      await AsyncStorage.setItem(STORAGE_KEYS.WORD_OF_DAY_DATE, today);
      await AsyncStorage.setItem(STORAGE_KEYS.WORD_OF_DAY_ID, wordId);
      dispatch({
        type: actionTypes.SET_WORD_OF_DAY,
        payload: { word: wordId, date: today },
      });
    },
  };

  return (
    <AppContext.Provider value={{ state, actions }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

export const LANGUAGES = [
  { code: 'wo', name: 'Wolof', nativeName: 'Wolof', flag: '🇸🇳' },
  { code: 'fr', name: 'Français', nativeName: 'French', flag: '🇫🇷' },
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'ar', name: 'العربية', nativeName: 'Arabic', flag: '🇸🇦' },
  { code: 'es', name: 'Español', nativeName: 'Spanish', flag: '🇪🇸' },
];

export function getLanguageName(code) {
  const lang = LANGUAGES.find((l) => l.code === code);
  return lang ? lang.name : code;
}

export function getLanguageFlag(code) {
  const lang = LANGUAGES.find((l) => l.code === code);
  return lang ? lang.flag : '';
}
