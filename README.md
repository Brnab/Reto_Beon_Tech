# QA Automation Exercise - BEON.tech

This repository contains the test automation solution for the **QA Automation Engineer (BEON.tech)** technical challenge, structured into two dedicated modules:

- **Part 1: API Automation Challenge (`karate-api`)** targeting **Restful-Booker** using **Karate DSL + Java 17 + Maven**.
- **Part 2: UI Automation Challenge (`playwright-ui`)** targeting **SauceDemo (Swag Labs)** using **Playwright + TypeScript (Page Object Model)**.
- **Part 3: Deliverables** including technical documentation, test reporting integration (**Playwright HTML Reporter** and **Karate HTML Report**), and the **Manual QA Bug Report (Simulated Jira Ticket)** template.

---

## 📋 1. Prerequisites

To install and run the tests in this repository, ensure you have the following installed:

- **Java JDK 17** or higher (required to run Karate DSL in `karate-api`).
- **Apache Maven 3.8+** (to manage dependencies and execute the JUnit 5 API test runner).
  - *Local environment note:* Maven is also available locally at `C:\Users\Usuario\.tools\apache-maven-3.9.9\bin\mvn.cmd`.
- **Node.js v18+** and **npm** (required to run Playwright + TypeScript in `playwright-ui`).
- **Playwright Browsers** (Chromium installed via the Playwright CLI).

---

## ⚙️ 2. Installation Instructions

### Step 1: Clone the repository and navigate to the project root
```bash
git clone <REPOSITORY_URL>
cd Beon
```

### Step 2: Install dependencies and browsers for the UI module (`playwright-ui`)
```bash
cd playwright-ui
npm install
npx playwright install chromium
```

### Step 3: Download dependencies and compile the API module (`karate-api`)
```bash
cd ../karate-api
mvn test-compile
```
*(In PowerShell, if Maven is not in your global `PATH`: `& "C:\Users\Usuario\.tools\apache-maven-3.9.9\bin\mvn.cmd" test-compile`)*

---

## 🚀 3. Execution Commands

### A. UI vs API

- **Run API Tests (Part 1 - Restful-Booker with Karate DSL):**
  ```bash
  cd karate-api
  mvn test
  ```
  *(Or in local PowerShell: `& "C:\Users\Usuario\.tools\apache-maven-3.9.9\bin\mvn.cmd" test`)*

- **Run UI Tests (Part 2 - SauceDemo with Playwright):**
  ```bash
  cd playwright-ui
  npm test
  # Or directly via Playwright CLI:
  npx playwright test
  ```

---

### B. Headless vs UI (Visual & Interactive Execution Modes)

- **Headless Mode (no browser UI, ideal for CI/CD pipelines - default configuration):**
  ```bash
  cd playwright-ui
  npm test
  ```

- **Headed Mode (launches a visible Chromium browser window during execution):**
  ```bash
  cd playwright-ui
  npm run test:headed
  # Or directly:
  npx playwright test --headed
  ```

- **Playwright Interactive UI Mode (Time-Travel Debugging and step-by-step DOM inspection):**
  ```bash
  cd playwright-ui
  npm run test:ui
  # Or directly:
  npx playwright test --ui
  ```

---

## 📊 4. Test Reporting

The framework integrates HTML reporting tools for both UI and API test suites:

1. **Playwright HTML Reporter (`playwright-ui`):**
   Configured in `playwright.config.ts` (`reporter: [['list'], ['html', { open: 'never' }]]`), automatically capturing **screenshots on failure** (`screenshot: 'only-on-failure'`), **videos** (`video: 'retain-on-failure'`), and **execution traces** (`trace: 'on-first-retry'`).
   - To open the interactive HTML report in your browser:
     ```bash
     cd playwright-ui
     npm run report
     # Or directly:
     npx playwright show-report
     ```

2. **Karate HTML Report (`karate-api`):**
   Automatically generated after each `mvn test` execution at:
   ```text
   karate-api/target/karate-reports/karate-summary.html
   ```

---

## 🏗️ 5. Explanation of Framework Architecture

### Project Directory Structure

```text
Beon/
├── .gitignore                        # Excludes .claude, .github, node_modules, target, and reports
├── .ignore                           # Excludes .claude and .github
├── README.md                         # Project documentation, commands, architecture, and Bug Report
├── karate-api/                       # Part 1: API Automation Challenge (Restful-Booker)
│   ├── pom.xml                       # Maven configuration, Karate 1.4.1, and JUnit 5
│   └── src/test/
│       ├── java/com/beon/qa/api/
│       │   ├── ApiTestRunner.java    # JUnit 5 runner for Karate features
│       │   └── booking.feature       # Chained end-to-end booking lifecycle scenario
│       └── resources/
│           └── karate-config.js      # Centralized baseUrl and timeout configuration
└── playwright-ui/                    # Part 2: UI Automation Challenge (SauceDemo / Swag Labs)
    ├── package.json                  # Execution scripts and dependencies (@playwright/test, TypeScript)
    ├── playwright.config.ts          # Global Playwright config (baseURL, timeouts, HTML reporter)
    ├── tsconfig.json                 # TypeScript compiler configuration
    ├── pages/                        # Page Object Model (POM) Layer
    │   ├── login.page.ts             # Login page locators and authentication actions
    │   ├── landingpage.ts            # Inventory page and dynamic selection of N distinct items
    │   ├── cart.page.ts              # Cart verification (items, prices, and quantities)
    │   └── checkout.page.ts          # Checkout form, order overview, and confirmation validation
    └── tests/                        # E2E Test Specifications Layer
        └── register-login.spec.ts    # End-to-end SauceDemo critical e-commerce checkout flow
```

### Architectural & Technical Decisions

1. **Page Object Model (POM) & Clean Code (DRY Principle):**
   - Each page of the web application is modeled as an independent class inside `playwright-ui/pages/` (`LoginPage`, `LandingPage`, `CartPage`, `CheckoutPage`).
   - DOM selectors (`Locator`) are encapsulated as `readonly` properties within each Page Object, preventing code duplication (**DRY**) and keeping test specification files (`tests/register-login.spec.ts`) clean, readable, and strictly focused on business flow and assertions.

2. **Resilient Locator Strategy:**
   - The UI suite prioritizes dedicated test attributes (`[data-test="..."]`) across all SauceDemo views (`[data-test="username"]`, `[data-test="inventory-item"]`, `[data-test="shopping-cart-badge"]`, `[data-test="complete-header"]`, etc.), completely avoiding brittle XPaths or styling-dependent CSS selectors.

3. **Dynamic Product Selection & Wait Handling (Page Transitions):**
   - In `LandingPage.addDistinctItemsDynamically(2)`, the method queries the total count of rendered inventory items, dynamically shuffles available indices at runtime to pick **2 distinct products**, captures their real names and prices from the DOM, and clicks their `Add to cart` buttons.
   - Zero hard-coded sleeps (`waitForTimeout`) are used. Instead, Playwright's **Web-First Assertions** (`await expect(...).toBeVisible()`, `toHaveText()`, `toHaveCount()`, `toHaveURL()`) handle synchronization across every state change (button transitioning from `Add to cart` to `Remove`, cart badge counter update, and page transitions across `/inventory.html`, `/cart.html`, `/checkout-step-one.html`, `/checkout-step-two.html`, and `/checkout-complete.html`).

4. **API State Handling & Request Chaining (`karate-api`):**
   - In `booking.feature`, the full lifecycle of a booking on **Restful-Booker** is automated by chaining state and data from each response into subsequent requests:
     1. **Authentication (`POST /auth`):** Generates and extracts the authentication token (`authToken`).
     2. **Create Booking (`POST /booking`):** Creates a booking using `initialBooking`, validates `200 OK`, and extracts `bookingId` (`response.bookingid`).
     3. **Read Booking (`GET /booking/{id}`):** Fetches the created booking using `bookingId` and asserts that the response payload matches `initialBooking`.
     4. **Update Booking (`PUT /booking/{id}`):** Passes the auth token in the request header (`Cookie: token=<authToken>`), updates the `checkout` date, and validates the updated response payload.
     5. **Delete Booking (`DELETE /booking/{id}` + `GET /booking/{id}`):** Deletes the booking with the auth token, validates `201 Created`, and performs a follow-up `GET` request to confirm `404 Not Found`.

---

## 🐞 6. Manual QA Bug Report (Simulated Jira Ticket)

> **Target Application:** SauceDemo (`https://www.saucedemo.com/`)  
> **Test User:** `problem_user`

### Jira Ticket

- **Title:**  
  `Item Images are the same`

- **Description:**  
  `When logged in with credentials user : problem_user, and password: secret_sauce in the landing page, the images in all the items are the same`

- **Steps to Reproduce:**  
  1. Navigate to `https://www.saucedemo.com/`
  2. Log in with credentials `problem_user` and `secret_sauce`.
  3. Check images of the items

- **Expected Result:**  
  `It is expected that the items have different images`

- **Actual Result:**  
  `Currently all the items have the same image`

- **Severity:**  
  `Low`
