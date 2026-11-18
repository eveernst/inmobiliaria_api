// Swagger UI lists every endpoint and DTO, so it must not be public in
// production unless someone opts in with ENABLE_SWAGGER=true (issue #73).
export function isSwaggerEnabled(
  env: Record<string, string | undefined>,
): boolean {
  return env.NODE_ENV !== 'production' || env.ENABLE_SWAGGER === 'true';
}
