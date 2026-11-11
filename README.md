# Playwright QA Framework

End-to-end test automation framework for [SauceDemo](https://www.saucedemo.com), built with **Playwright** and **TypeScript**.

## Tech stack
- Playwright Test + TypeScript
- Page Object Model + custom fixtures
- dotenv for environment config
- HTML reports with screenshots, videos and traces on failure

## Test coverage
| Area | Tests |
| --- | --- |
| Login | valid login, locked user, wrong password |
| Login checklist | 5 data-driven negative cases, masked password, closable error, logout, protected page |
| Products | product count, add/remove from cart, price sorting |
| Checkout | full end-to-end purchase with price/tax verification, required-field validation |

## Project structure


playwright-qa-framework/
├── pages/ Page objects (one class per page)
├── fixtures/ Custom fixtures providing ready page objects
├── test-data/ Shared test data (credentials from .env)
├── tests/
│ ├── auth.setup.ts Logs in once and saves the session
│ └── ui/ UI test specs
├── .env.example Template for required environment variables
└── playwright.config.ts


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
| `npm run test:chromium` | All tests, Chromium only |
| `npm run test:smoke` | Only `@smoke` tests (quick check) |
| `npm run test:ui` | Playwright UI Mode |
| `npm run report` | Open the last HTML report |

## Design decisions
- **Page Object Model**: locators live in one place, so a UI change means one fix
- **Custom fixtures**: tests declare what they need (`{ inventoryPage }`) instead of repeating setup
- **Saved login state**: a setup project logs in once; tests reuse the session (`storageState`)
- **No secrets in code**: credentials come from environment variables; `.env` is git-ignored
- **User-facing locators first**: `getByRole` / `getByLabel`, then `data-test` ids as a stable fallback
- **Evidence on failure**: screenshots, videos and traces are kept only for failed tests

## Roadmap
- [x] UI tests with Page Object Model and fixtures
- [ ] API tests
- [ ] Network mocking, visual and accessibility tests
- [ ] CI pipeline with GitHub Actions
- [ ] AI-assisted test workflow