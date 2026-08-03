import { useState } from "react";
import {
  reauthenticateWithCredential,
  EmailAuthProvider,
  updatePassword,
  updateEmail,
} from "firebase/auth";

import { auth } from "@firebase_setup/firebase";
import { handleFirebaseError } from "@utils/getFirebaseError";

import "./Security.scss";

const Security = () => {
  const [activeForm, setActiveForm] = useState<"password" | "email" | null>(
    null,
  );

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [newEmail, setNewEmail] = useState("");
  const [emailPassword, setEmailPassword] = useState("");

  const reauthenticate = async (email: string, password: string) => {
    const user = auth.currentUser;
    if (!user) throw new Error("Пользователь не авторизован");
    const credential = EmailAuthProvider.credential(email, password);
    await reauthenticateWithCredential(user, credential);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      alert("Пароли не совпадают");
      return;
    }
    if (newPassword.length < 6) {
      alert("Пароль должен быть не менее 6 символов");
      return;
    }
    setIsLoading(true);
    try {
      const user = auth.currentUser;
      if (!user || !user.email) throw new Error("Нет данных пользователя");
      await reauthenticate(user.email, currentPassword);
      await updatePassword(user, newPassword);
      alert("Пароль успешно изменён");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
      setActiveForm(null);
    } catch (error) {
      handleFirebaseError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangeEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail) {
      alert("Введите новый email");
      return;
    }
    setIsLoading(true);
    try {
      const user = auth.currentUser;
      if (!user || !user.email) throw new Error("Нет данных пользователя");
      await reauthenticate(user.email, emailPassword);
      await updateEmail(user, newEmail);
      alert("Email успешно изменён");
      setNewEmail("");
      setEmailPassword("");
      setActiveForm(null);
    } catch (error) {
      handleFirebaseError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="security">
      <div className="settings-section">
        <h3>Безопасность</h3>
        <div className="setting-group actions">
          <button
            className="btn-outline"
            onClick={() =>
              setActiveForm(activeForm === "password" ? null : "password")
            }
          >
            Сменить пароль
          </button>
          <button
            className="btn-outline"
            onClick={() =>
              setActiveForm(activeForm === "email" ? null : "email")
            }
          >
            Сменить email
          </button>
        </div>

        {activeForm === "password" && (
          <form className="settings-form" onSubmit={handleChangePassword}>
            <input
              type="password"
              placeholder="Текущий пароль"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              disabled={isLoading}
            />
            <input
              type="password"
              placeholder="Новый пароль"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              disabled={isLoading}
            />
            <input
              type="password"
              placeholder="Подтвердите пароль"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              disabled={isLoading}
            />
            <button type="submit" disabled={isLoading}>
              Сохранить пароль
            </button>
          </form>
        )}

        {activeForm === "email" && (
          <form className="settings-form" onSubmit={handleChangeEmail}>
            <input
              type="email"
              placeholder="Новый email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              disabled={isLoading}
            />
            <input
              type="password"
              placeholder="Текущий пароль (для подтверждения)"
              value={emailPassword}
              onChange={(e) => setEmailPassword(e.target.value)}
              disabled={isLoading}
            />
            <button type="submit" disabled={isLoading}>
              Сохранить email
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Security;
