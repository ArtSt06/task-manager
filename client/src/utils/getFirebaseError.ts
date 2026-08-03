import { FirebaseError } from "firebase/app";

import { FIREBASE_ERROR_MESSAGES } from "@firebase_setup/firebaseErrors";

export const getFirebaseErrorMessage = (errorCode: string): string => {
  return (
    FIREBASE_ERROR_MESSAGES[errorCode] || "Произошла ошибка. Попробуйте позже."
  );
};

export const handleFirebaseError = (error: unknown): never => {
  if (error instanceof FirebaseError) {
    throw new Error(getFirebaseErrorMessage(error.code), { cause: error });
  }
  throw new Error("Произошла неизвестная ошибка", { cause: error });
};
