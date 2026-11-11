// env.ts
// Reads a required environment variable, failing loudly if it's missing.

export function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing environment variable "${name}". Create a .env file (see .env.example).`);
  }
  return value;
}