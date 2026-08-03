import UserPreferences from "@components/settings/UserPreferences";
import DataManagement from "@components/settings/DataManagement";
import Security from "@components/settings/Security";

import "./SettingsPage.scss";

const SettingsPage = () => {
  return (
    <div className="settings-page">
      <h2>Настройки</h2>

      <UserPreferences />

      <DataManagement />

      <Security />
    </div>
  );
};

export default SettingsPage;
