import type { Theme, Priority, Settings } from "@shared/types";

import toast from "react-hot-toast";

import { useAppDispatch, useAppSelector } from "@store/reduxHooks";
import { FirebaseError } from "firebase/app";

import {
  selectTheme,
  selectDefaultPriority,
  selectDefaultStatus,
  selectConfirmDelete,
  selectSettingsLoading,
} from "@store/features/settings/settingsSelectors";

import {
  setTheme,
  setDefaultPriority,
  setDefaultStatus,
  setConfirmDelete,
  patchSettings,
  resetSettings,
} from "@store/features/settings/settingsSlice";

import { useConfirm } from "@contexts/ConfirmContext";
import { getFirebaseError } from "@utils/getFirebaseError";

import CustomSelect from "@components/common/CustomSelect";

import {
  PRIORITIES,
  STATUSES,
  PRIORITY_LABELS,
  STATUS_LABELS,
  THEME_LABELS,
  THEMES,
} from "@shared/constants";

import "./UserPreferences.scss";

const handleSettingsError = (error: unknown, fallbackMessage: string) => {
  if (error instanceof FirebaseError) {
    toast.error(getFirebaseError(error));
  } else {
    toast.error(fallbackMessage);
  }
};

const UserPreferences = () => {
  const dispatch = useAppDispatch();
  const { confirm } = useConfirm();

  const theme = useAppSelector(selectTheme);
  const defaultPriority = useAppSelector(selectDefaultPriority);
  const defaultStatus = useAppSelector(selectDefaultStatus);
  const confirmDelete = useAppSelector(selectConfirmDelete);
  const settingsLoading = useAppSelector(selectSettingsLoading);

  const themeOptions = THEMES.map((theme) => ({
    value: theme,
    label: THEME_LABELS[theme],
  }));

  const priorityOptions = PRIORITIES.map((priority) => ({
    value: priority,
    label: PRIORITY_LABELS[priority],
  }));

  const statusOptions = STATUSES.filter((status) => status !== "done").map(
    (status) => ({
      value: status,
      label: STATUS_LABELS[status],
    }),
  );

  const handleThemeChange = async (value: string) => {
    const newTheme = value as Theme;

    dispatch(setTheme(newTheme));

    try {
      await dispatch(patchSettings({ theme: newTheme })).unwrap();
    } catch (error) {
      handleSettingsError(error, "Не удалось сохранить настройки");
    }
  };

  const handlePriorityChange = async (value: string) => {
    const newPriority = value as Priority;

    dispatch(setDefaultPriority(newPriority));

    try {
      await dispatch(patchSettings({ defaultPriority: newPriority })).unwrap();
    } catch (error) {
      handleSettingsError(error, "Не удалось сохранить настройки");
    }
  };

  const handleStatusChange = async (value: string) => {
    const newStatus = value as Settings["defaultStatus"];

    dispatch(setDefaultStatus(newStatus));

    try {
      await dispatch(patchSettings({ defaultStatus: newStatus })).unwrap();
    } catch (error) {
      handleSettingsError(error, "Не удалось сохранить настройки");
    }
  };

  const handleConfirmDeleteChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const newValue = event.target.checked;

    dispatch(setConfirmDelete(newValue));

    try {
      await dispatch(patchSettings({ confirmDelete: newValue })).unwrap();
    } catch (error) {
      handleSettingsError(error, "Не удалось сохранить настройки");
    }
  };

  const handleResetSettings = async () => {
    const confirmed = await confirm(
      "Сбросить все настройки к значениям по умолчанию?",
      {
        title: "Сброс настроек",
        confirmText: "Сбросить",
        cancelText: "Отмена",
      },
    );
    if (!confirmed) return;

    try {
      await dispatch(resetSettings()).unwrap();
      toast.success("Настройки сброшены");
    } catch (error) {
      handleSettingsError(error, "Ошибка сброса настроек");
    }
  };

  return (
    <div className="settings-container user-preferences">
      <section className="settings-section">
        <h3 className="section-title">Внешний вид</h3>
        <div className="setting-group">
          <label className="group-label" htmlFor="theme">
            Тема
          </label>

          <CustomSelect
            id="theme"
            value={theme}
            onChange={handleThemeChange}
            options={themeOptions}
            className="settings-select"
            disabled={settingsLoading}
          />
        </div>
      </section>

      <section className="settings-section">
        <h3 className="section-title">Задачи по умолчанию</h3>

        <div className="setting-group">
          <label className="group-label" htmlFor="defaultPriority">
            Приоритет
          </label>

          <CustomSelect
            id="defaultPriority"
            value={defaultPriority}
            onChange={handlePriorityChange}
            options={priorityOptions}
            className="settings-select"
            disabled={settingsLoading}
          />
        </div>

        <div className="setting-group">
          <label className="group-label" htmlFor="defaultStatus">
            Статус
          </label>

          <CustomSelect
            id="defaultStatus"
            value={defaultStatus}
            onChange={handleStatusChange}
            options={statusOptions}
            className="settings-select"
            disabled={settingsLoading}
          />
        </div>
      </section>

      <section className="settings-section">
        <h3 className="section-title">Поведение</h3>

        <div className="setting-group checkbox">
          <input
            id="confirmDelete"
            type="checkbox"
            checked={confirmDelete}
            onChange={handleConfirmDeleteChange}
            disabled={settingsLoading}
          />

          <label className="group-label" htmlFor="confirmDelete">
            Подтверждать удаление задач
          </label>
        </div>
      </section>

      <section className="settings-section">
        <h3 className="section-title">Сброс настроек пользователя</h3>

        <div className="setting-group action">
          <button onClick={handleResetSettings} disabled={settingsLoading}>
            Сбросить настройки
          </button>
        </div>
      </section>
    </div>
  );
};

export default UserPreferences;
