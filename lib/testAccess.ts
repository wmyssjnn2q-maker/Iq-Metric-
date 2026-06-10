/** Hasło do ukrytego dostępu testowego (odblokowanie raportu bez Stripe). */
export const IQ_TEST_ACCESS_PASSWORD = 'gazelka2005';

export const verifyIqTestPassword = (password: string): boolean =>
  password.trim() === IQ_TEST_ACCESS_PASSWORD;
