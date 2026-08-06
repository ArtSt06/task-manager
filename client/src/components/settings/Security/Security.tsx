import { useState } from "react";
import {
  reauthenticateWithCredential,
  EmailAuthProvider,
  updatePassword,
  updateEmail,
} from "firebase/auth";

import toast from "react-hot-toast";

import { auth } from "@firebase_setup/firebase";
import { getFirebaseError } from "@utils/getFirebaseError";

import "./Security.scss";

const Security = () => {
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

  const handleChangePassword = async (event: React.SubmitEvent) => {
    event.preventDefault();

    if (newPassword !== confirmNewPassword) {
      toast.error("Пароли не совпадают");
      return;
    }

    setIsLoading(true);

    try {
      const user = auth.currentUser;
      if (!user || !user.email) throw new Error("Нет данных пользователя");

      await reauthenticate(user.email, currentPassword);
      await updatePassword(user, newPassword);

      toast.success("Пароль успешно изменён");

      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (error) {
      toast.error(getFirebaseError(error));
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangeEmail = async (event: React.SubmitEvent) => {
    event.preventDefault();

    if (!newEmail) {
      toast.error("Введите новый email");
      return;
    }

    setIsLoading(true);

    try {
      const user = auth.currentUser;
      if (!user || !user.email) throw new Error("Нет данных пользователя");

      await reauthenticate(user.email, emailPassword);
      await updateEmail(user, newEmail);

      toast.success("Email успешно изменён");

      setNewEmail("");
      setEmailPassword("");
    } catch (error) {
      toast.error(getFirebaseError(error));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="settings-container security">
      <div className="settings-section">
        <h3 className="section-title">Безопасность</h3>

        <form
          className="settings-form setting-group"
          onSubmit={handleChangePassword}
        >
          <div className="form-assets">
            <label className="group-label" htmlFor="currentPassword">
              Смена пароля
            </label>
          </div>

          <div className="form-inputs">
            <input
              id="currentPassword"
              type="password"
              placeholder="Текущий пароль"
              value={currentPassword}
              onChange={(event) => setCurrentPassword(event.target.value)}
              disabled={isLoading}
            />
            <input
              id="newPassword"
              type="password"
              placeholder="Новый пароль"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              disabled={isLoading}
            />
            <input
              id="newPasswordRepeat"
              type="password"
              placeholder="Подтвердите пароль"
              value={confirmNewPassword}
              onChange={(event) => setConfirmNewPassword(event.target.value)}
              disabled={isLoading}
            />
          </div>

          <button type="submit" disabled={isLoading}>
            Сохранить пароль
          </button>
        </form>

        <form
          className="settings-form setting-group"
          onSubmit={handleChangeEmail}
        >
          <div className="form-assets">
            <label className="group-label" htmlFor="email">
              Смена email
            </label>
          </div>

          <div className="form-inputs">
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="Новый email"
              value={newEmail}
              onChange={(event) => setNewEmail(event.target.value)}
              disabled={isLoading}
            />
            <input
              id="password"
              type="password"
              placeholder="Текущий пароль"
              value={emailPassword}
              onChange={(event) => setEmailPassword(event.target.value)}
              disabled={isLoading}
            />
          </div>

          <button type="submit" disabled={isLoading}>
            Сохранить email
          </button>
        </form>
      </div>
    </div>
  );
};

export default Security;
