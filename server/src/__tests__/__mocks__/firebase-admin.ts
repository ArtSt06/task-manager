export const initializeApp = jest.fn();
export const getApps = jest.fn(() => []);
export const cert = jest.fn();

export const getAuth = jest.fn(() => ({
  verifyIdToken: jest.fn(),
}));

export default {
  initializeApp,
  getApps,
  cert,
  getAuth,
};