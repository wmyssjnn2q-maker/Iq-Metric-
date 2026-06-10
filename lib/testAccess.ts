/** Hasło do ukrytego dostępu testowego (IQ i inne testy, bez Stripe). */
export const TEST_ACCESS_PASSWORD = 'gazelka2005';

export const verifyTestAccessPassword = (password: string): boolean =>
  password.trim() === TEST_ACCESS_PASSWORD;

/** @deprecated Użyj verifyTestAccessPassword */
export const verifyIqTestPassword = verifyTestAccessPassword;
