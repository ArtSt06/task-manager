import { describe, it, expect, jest, beforeEach } from "@jest/globals";

import {
  getSettings,
  updateSettings,
  resetSettings as resetSettingsApi,
} from "@api/settings";

import settingsReducer, {
  fetchSettings,
  patchSettings,
  resetSettings,
  setTheme,
  setDefaultPriority,
  setDefaultStatus,
  setConfirmDelete,
} from "@store/features/settings/settingsSlice";

jest.mock("@api/settings", () => ({
  getSettings: jest.fn(),
  updateSettings: jest.fn(),
  resetSettings: jest.fn(),
}));

const mockedGetSettings = getSettings as jest.MockedFunction<
  typeof getSettings
>;
const mockedUpdateSettings = updateSettings as jest.MockedFunction<
  typeof updateSettings
>;
const mockedResetSettings = resetSettingsApi as jest.MockedFunction<
  typeof resetSettingsApi
>;

const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

Object.defineProperty(window, "localStorage", { value: localStorageMock });

describe("settingsSlice", () => {
  const defaultSettings = {
    theme: "system" as const,
    defaultPriority: "medium" as const,
    defaultStatus: "todo" as const,
    confirmDelete: true,
  };

  const initialState = {
    ...defaultSettings,
    loading: false,
    error: null,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  it("should return initial state", () => {
    expect(settingsReducer(undefined, { type: "@@INIT" })).toEqual(
      initialState,
    );
  });

  describe("synchronous reducers", () => {
    it("should set theme and save to localStorage", () => {
      const state = settingsReducer(initialState, setTheme("dark"));

      expect(state.theme).toBe("dark");
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        "taskManagerTheme",
        "dark",
      );
    });

    it("should set default priority", () => {
      const state = settingsReducer(initialState, setDefaultPriority("high"));

      expect(state.defaultPriority).toBe("high");
    });

    it("should set default status", () => {
      const state = settingsReducer(
        initialState,
        setDefaultStatus("inProgress"),
      );

      expect(state.defaultStatus).toBe("inProgress");
    });

    it("should set confirm delete", () => {
      const state = settingsReducer(initialState, setConfirmDelete(false));

      expect(state.confirmDelete).toBe(false);
    });
  });

  describe("async thunks", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    describe("fetchSettings", () => {
      it("should set loading true when pending", () => {
        const action = { type: fetchSettings.pending.type };
        const state = settingsReducer(initialState, action);

        expect(state.loading).toBe(true);
        expect(state.error).toBeNull();
      });

      it("should set settings on fulfilled", async () => {
        const mockSettings = {
          theme: "dark" as const,
          defaultPriority: "high" as const,
          defaultStatus: "inProgress" as const,
          confirmDelete: false,
        };
        
        mockedGetSettings.mockResolvedValue({ settings: mockSettings });

        const action = await fetchSettings.fulfilled(mockSettings, "");
        const state = settingsReducer(initialState, action);

        expect(state.loading).toBe(false);
        expect(state.theme).toBe("dark");
        expect(state.defaultPriority).toBe("high");
        expect(state.defaultStatus).toBe("inProgress");
        expect(state.confirmDelete).toBe(false);
        expect(localStorageMock.setItem).toHaveBeenCalledWith(
          "taskManagerTheme",
          "dark",
        );
      });

      it("should set error on rejected", () => {
        const error = new Error("Ошибка загрузки настроек");
        const action = { type: fetchSettings.rejected.type, error };
        const state = settingsReducer(initialState, action);

        expect(state.loading).toBe(false);
        expect(state.error).toBe("Ошибка загрузки настроек");
      });
    });

    describe("patchSettings", () => {
      it("should update settings on fulfilled", async () => {
        const updatedSettings = {
          theme: "light" as const,
          defaultPriority: "medium" as const,
          defaultStatus: "todo" as const,
          confirmDelete: false,
        };
        mockedUpdateSettings.mockResolvedValue({ settings: updatedSettings });

        const action = await patchSettings.fulfilled(updatedSettings, "", {
          theme: "light",
        });
        const state = settingsReducer(initialState, action);

        expect(state.theme).toBe("light");
        expect(state.confirmDelete).toBe(false);
        expect(localStorageMock.setItem).toHaveBeenCalledWith(
          "taskManagerTheme",
          "light",
        );
      });
    });

    describe("resetSettings", () => {
      it("should reset settings on fulfilled", async () => {
        const defaultFromApi = {
          theme: "system" as const,
          defaultPriority: "medium" as const,
          defaultStatus: "todo" as const,
          confirmDelete: true,
        };
        mockedResetSettings.mockResolvedValue({ settings: defaultFromApi });

        const action = await resetSettings.fulfilled(defaultFromApi, "");
        const state = settingsReducer(initialState, action);

        expect(state.theme).toBe("system");
        expect(state.defaultPriority).toBe("medium");
        expect(state.defaultStatus).toBe("todo");
        expect(state.confirmDelete).toBe(true);
        expect(localStorageMock.setItem).toHaveBeenCalledWith(
          "taskManagerTheme",
          "system",
        );
      });
    });
  });
});
