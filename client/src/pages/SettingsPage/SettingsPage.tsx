import UserPreferences from "@components/settings/UserPreferences";
import DataManagement from "@components/settings/DataManagement";
import Security from "@components/settings/Security";

import "./SettingsPage.scss";

const SettingsPage = () => {
  return (
    <div className="settings-page page">
      <h2 className="page-title">Настройки</h2>

      <div className="settings-grid">
        <UserPreferences />

        <DataManagement />

        <Security />
      </div>
    </div>
  );
};

export default SettingsPage;
