export function aiConfiguration(
  environment: Record<string, string | undefined>,
) {
  const providerId = environment.REVALUE_AI_PROVIDER?.trim();
  const modelId = environment.REVALUE_AI_MODEL?.trim();
  const apiKey = environment.REVALUE_AI_KEY?.trim();
  if (!providerId || !modelId || !apiKey) return null;
  const baseUrl = environment.REVALUE_AI_BASE_URL?.trim();
  return { providerId, modelId, apiKey, ...(baseUrl ? { baseUrl } : {}) };
}
