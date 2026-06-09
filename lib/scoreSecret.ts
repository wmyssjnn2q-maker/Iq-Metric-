export const getScoreSecret = (): string | undefined => {
  const secret = process.env.SCORE_SECRET?.trim();
  if (!secret || secret.length < 16) return undefined;
  if (secret === 'zmien_na_dlugi_losowy_ciag_znakow') return undefined;
  return secret;
};

export const isScoreSecretConfigured = (): boolean => Boolean(getScoreSecret());

export const ensureScoreEnv = (): void => {};
