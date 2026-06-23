export function validateEnv(config: Record<string, string>) {
  if (!config.CORS_ORIGIN) {
    throw new Error("CORS_ORIGIN is required");
  }

  return config;
}
