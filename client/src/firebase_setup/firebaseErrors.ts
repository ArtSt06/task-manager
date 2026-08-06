export const FIREBASE_ERROR_MESSAGES: Record<string, string> = {
  "auth/invalid-credential": "Неверный логин или пароль",
  "auth/email-already-in-use": "Этот email уже используется.",
  "auth/wrong-password": "Неверный пароль. Попробуйте снова.",
  "auth/user-not-found": "Пользователь с таким email не найден.",
  "auth/invalid-email": "Некорректный email.",
  "auth/missing-password": "Необходимо ввести пароль",
  "auth/weak-password": "Пароль должен быть не менее 6 символов.",
  "auth/too-many-requests": "Слишком много попыток. Попробуйте позже.",
  "auth/network-request-failed": "Ошибка сети. Проверьте подключение.",
  "auth/credential-too-old-login-again":
    "Для этого действия требуется повторный вход.",
  "auth/requires-recent-login": "Требуется повторный вход.",
  "auth/internal-error": "Внутренняя ошибка сервера. Попробуйте позже.",
};
