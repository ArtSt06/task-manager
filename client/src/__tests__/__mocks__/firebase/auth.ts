export const signInWithEmailAndPassword = jest.fn();
export const createUserWithEmailAndPassword = jest.fn();
export const signOut = jest.fn();
export const onAuthStateChanged = jest.fn();
export const sendPasswordResetEmail = jest.fn();

export const EmailAuthProvider = {
  credential: jest.fn(),
};

export const getAuth = jest.fn(() => ({
  currentUser: null,
  onAuthStateChanged,
}));