# Playwright QA Framework

Test automation framework built with **Playwright** and **TypeScript**, covering:
- **UI tests** for [SauceDemo](https://www.saucedemo.com)
- **API tests** for [Restful-Booker](https://restful-booker.herokuapp.com)

## Tech stack
- Playwright Test + TypeScript
- Page Object Model + custom fixtures
- API client classes + Zod schema validation (contract tests)
- dotenv for environment config
- HTML reports with screenshots, videos and traces on failure

## Test coverage
| Area | Tests |
| --- | --- |
| Login | valid login, locked user, wrong password |
| Login checklist | 5 data-driven negative cases, masked password, closable error, logout, protected page |
| Products | product count, add/remove from cart, price sorting |
| Checkout | full end-to-end purchase with price/tax verification, required-field validation |
| API (Restful-Booker) | CRUD, auth tokens, contract tests with Zod schemas, known-bug tracking |
| Hybrid | cart set up via browser storage, verified in the UI |

## Project structure
```
playwright-qa-framework/
├── api/            API client classes (one per API resource)
├── pages/          Page objects (one class per page)
├── fixtures/       Custom fixtures (pages.ts for UI, api.ts for API)
├── schemas/        Zod schemas: API response contracts
├── test-data/      Shared test data (credentials from .env)
├── utils/          Shared helpers (env variables, schema assertions)
├── tests/
│   ├── auth.setup.ts   Logs in once and saves the session
│   ├── ui/             UI test specs
│   └── api/            API test specs
├── .env.example    Template for required environment variables
└── playwright.config.ts
```

## Getting started
```bash
npm install
npx playwright install
cp .env.example .env   # then fill in the values
```

## Running tests
| Command | Description |
| --- | --- |
| `npm test` | All tests, all browsers |
| `npm run test:chromium` | UI tests, Chromium only |
| `npm run test:api` | API tests only |
| `npm run test:smoke` | Only `@smoke` tests (quick check) |
| `npm run test:ui` | Playwright UI Mode |
| `npm run report` | Open the last HTML report |

## Design decisions
- **Page Object Model**: locators live in one place, so a UI change means one fix
- **API client classes**: endpoints live in one place, same idea as page objects
- **Custom fixtures**: tests declare what they need (`{ inventoryPage }`, `{ bookingApi }`) instead of repeating setup
- **Cleanup in fixtures**: test data created for a test is deleted afterwards, even if the test fails
- **Contract tests**: Zod schemas check the shape and types of API responses
- **Known bugs are documented**: `test.fail()` keeps the suite green and alerts when a bug gets fixed
- **Saved login state**: a setup project logs in once; tests reuse the session (`storageState`)
- **Hybrid tests**: fast setup outside the UI, verification in the UI
- **No secrets in code**: credentials come from environment variables; `.env` is git-ignored
- **User-facing locators first**: `getByRole` / `getByLabel`, then `data-test` ids as a stable fallback
- **Evidence on failure**: screenshots, videos and traces are kept only for failed tests

## Roadmap
- [x] UI tests with Page Object Model and fixtures
- [x] API tests
- [ ] Network mocking, visual and accessibility tests
- [ ] CI pipeline with GitHub Actions
- [ ] AI-assisted test workflow