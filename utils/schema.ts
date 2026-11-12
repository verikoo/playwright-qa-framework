// schema.ts
// Asserts that data matches a Zod schema, listing every problem if it doesn't.
import { expect } from '@playwright/test';
import { z } from 'zod';

export function expectToMatchSchema(data: unknown, schema: z.ZodType): void {
    const result = schema.safeParse(data);

    const problems = result.success
        ? []
        : result.error.issues.map((issue) => `${issue.path.join('.')}: ${issue.message}`);

    expect(problems, 'Response should match the schema').toEqual([]);
}