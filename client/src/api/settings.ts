import type { Settings, SettingsResponse } from "@shared/types";

import { apiClient } from "@api/client";

const SETTINGS_ENDPOINT = "/user/settings";

export const getSettings = async (): Promise<SettingsResponse> => {
  return apiClient.get<SettingsResponse>(SETTINGS_ENDPOINT);
};

export const updateSettings = async (
  settings: Partial<Settings>,
): Promise<SettingsResponse> => {
  return apiClient.patch<SettingsResponse>(SETTINGS_ENDPOINT, settings);
};

export const resetSettings = async (): Promise<SettingsResponse> => {
  return apiClient.post<SettingsResponse>(`${SETTINGS_ENDPOINT}/reset`);
};
