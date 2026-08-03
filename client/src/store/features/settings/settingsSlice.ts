import type { PayloadAction } from "@reduxjs/toolkit";
import type { Settings, Theme } from "@shared/types";

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import {
  getSettings,
  updateSettings,
  resetSettings as resetSettingsApi,
} from "@api/settings";

import { DEFAULT_SETTINGS } from "@shared/constants";

const THEME_STORAGE_KEY = "taskManagerTheme";

const getStoredTheme = (): Theme => {
  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  if (stored === "light" || stored === "dark" || stored === "system") {
    return stored;
  }
  return DEFAULT_SETTINGS.theme;
};

const saveThemeToStorage = (theme: Theme) => {
  localStorage.setItem(THEME_STORAGE_KEY, theme);
};

export const fetchSettings = createAsyncThunk(
  "settings/fetchSettings",
  async () => {
    const response = await getSettings();
    return response.settings;
  },
);

export const patchSettings = createAsyncThunk(
  "settings/patchSettings",
  async (newSettings: Partial<Settings>) => {
    const response = await updateSettings(newSettings);
    return response.settings;
  },
);

export const resetSettings = createAsyncThunk(
  "settings/resetSettings",
  async () => {
    const response = await resetSettingsApi();
    return response.settings;
  },
);

interface SettingsState extends Settings {
  loading: boolean;
  error: string | null;
}

const initialState: SettingsState = {
  ...DEFAULT_SETTINGS,
  theme: getStoredTheme(),
  loading: false,
  error: null,
};

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<Theme>) => {
      state.theme = action.payload;
      saveThemeToStorage(action.payload);
    },
    setDefaultPriority: (
      state,
      action: PayloadAction<Settings["defaultPriority"]>,
    ) => {
      state.defaultPriority = action.payload;
    },
    setDefaultStatus: (
      state,
      action: PayloadAction<Settings["defaultStatus"]>,
    ) => {
      state.defaultStatus = action.payload;
    },
    setConfirmDelete: (state, action: PayloadAction<boolean>) => {
      state.confirmDelete = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSettings.fulfilled, (state, action) => {
        state.loading = false;
        Object.assign(state, action.payload);
        saveThemeToStorage(action.payload.theme);
      })
      .addCase(fetchSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Ошибка загрузки настроек";
      })
      .addCase(patchSettings.fulfilled, (state, action) => {
        Object.assign(state, action.payload);
        saveThemeToStorage(action.payload.theme);
      })
      .addCase(resetSettings.fulfilled, (state, action) => {
        Object.assign(state, action.payload);
        saveThemeToStorage(action.payload.theme);
      });
  },
});

export const {
  setTheme,
  setDefaultPriority,
  setDefaultStatus,
  setConfirmDelete,
} = settingsSlice.actions;

export default settingsSlice.reducer;
