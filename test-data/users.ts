// users.ts
// Test users. Credentials come from environment variables (.env locally, secrets on CI).

import { requireEnv } from '../utils/env';

export const users = {
  standard: {
    username: requireEnv('STANDARD_USER'),
    password: requireEnv('PASSWORD'),
  },
  lockedOut: {
    username: requireEnv('LOCKED_USER'),
    password: requireEnv('PASSWORD'),
  },
};