import { FirebaseError } from "firebase/app";

import { FIREBASE_ERROR_MESSAGES } from "@firebase_setup/firebaseErrors";

export const getFirebaseErrorMessage = (errorCode: string): string => {
  return (
    FIREBASE_ERROR_MESSAGES[errorCode] || "Произошла ошибка. Попробуйте позже."
  );
};

export const getFirebaseError = (error: unknown): string => {
  if (error instanceof FirebaseError) {
    return getFirebaseErrorMessage(error.code);
  }
  return "Произошла неизвестная ошибка";
};
