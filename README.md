
# KidCap HQ - Future CEO Academy 🚀

**KidCap HQ** is the world's #1 gamified business academy for kids. We turn screen time into real-world skills like entrepreneurship, financial literacy, and leadership through addictive mini-games, an RPG-style progression system, and AI-powered tutoring.

![KidCap HQ Banner](https://images.unsplash.com/photo-1544531586-fde5298cdd40?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80)

---

## 🌟 Key Features

### 🎓 Interactive Learning Engine
*   **Universal Lesson System**: 100+ gamified lessons covering Money Basics, Crypto, AI, and Global Trade.
*   **Ollie (AI Tutor)**: Powered by **Google Gemini 2.5**, Ollie provides real-time homework help, business advice, and cheeky bird puns.
*   **Book Library**: Read summaries of business classics like *Rich Dad Poor Dad* and *Shoe Dog* to earn XP. AI-powered summary generation for admins.

### 🎮 The Universal Business Arcade
Runs on our custom `GameEngine.tsx` supporting multiple genres:
*   **Tycoon Sims**: Lemonade Stand, Coffee Cart, Factory Manager.
*   **Action/Arcade**: Pizza Rush (Phaser-based driving), Rhythm Car Wash.
*   **Puzzle/Logic**: Recycling Sorter, Fair Trade Matcher.
*   **Clicker/Idle**: App Developer, Dropship Empire.
*   **Negotiation Battles**: A high-stakes dialogue game exclusive to Tycoon subscribers.

### 🌍 Localization & Accessibility
*   **Multi-Language Support**: Full **English** and **Arabic (RTL)** support via `i18next`.
*   **Accessible Design**: High-contrast modes, screen-reader friendly structure, and intuitive UI for kids.

### 🏫 Education & Management
*   **Teacher Dashboard**: Create assignments, manage student groups, and grade submissions with custom rubrics.
*   **Parent Dashboard**: Monitor screen time, view learning graphs, and manage subscriptions.
*   **Admin Console (CMS)**:
    *   **Dynamic Page Builder**: Create marketing pages without code.
    *   **Library Manager**: Add books and auto-generate summaries using AI.
    *   **User Management**: Impersonate users, manage classes, and moderation tools.

### 💎 Monetization & Progression
*   **Subscription System**: 
    *   **Intern (Free)**: Ad-supported, limited energy (hearts system), locked advanced content.
    *   **Founder**: Unlimited energy, custom HQ, full game access.
    *   **Board Member**: Family plans, parent dashboard.
    *   **Tycoon**: AI Consultant (Ollie) unlocked, exclusive "Negotiation" games.
*   **Energy Mechanics**: Robust hook-based system preventing infinite play for free users.
*   **BizStore**: Spend earned "BizCoins" on avatars, outfits, and power-ups.

---

## 🛠️ Tech Stack & Architecture

KidCap HQ is built as a robust **Client-Side Single Page Application (SPA)** using the latest modern web technologies.

| Category | Technology |
| :--- | :--- |
| **Core** | React 19, TypeScript, Vite |
| **State Management** | Zustand (with Persistence Middleware) |
| **Styling** | Tailwind CSS, Framer Motion |
| **Game Engine** | Phaser 3 + Custom React Reconciler |
| **AI Integration** | Google GenAI SDK (Gemini 2.5 Flash) |
| **Localization** | i18next, i18next-browser-languagedetector |
| **Testing** | Vitest, React Testing Library |

### 🛡️ Enterprise-Grade Stability
Recent audits have fortified the codebase against common exploits and crashes:
*   **Infinite Energy Exploit**: Fixed timestamp validation logic in `useEnergy.ts`.
*   **Save Corruption**: Implemented robust `NaN` and date parsing guards in `store.ts`.
*   **Runtime Crashes**: Added fallback rendering for invalid asset IDs in `Headquarters.tsx`.

---

## 🚀 Setup Tutorial

### Prerequisites
1.  **Node.js (v18+)**: [Download Here](https://nodejs.org/)
2.  **Google Gemini API Key**: [Get it from Google AI Studio](https://aistudio.google.com/) (Required for Ollie Chat & Library Generator).

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/your-username/kidcap-hq.git
    cd kidcap-hq
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Configure Environment**
    Create a `.env` file in the root directory:
    ```env
    API_KEY=your_google_gemini_api_key_here
    ```
    *Note: The app is configured to read `process.env.API_KEY`. Vite handles this automatically if prefixed with `VITE_` or configured in `vite.config.ts`.*

4.  **Run Development Server**
    ```bash
    npm run dev
    ```
    Open `http://localhost:5173` in your browser.

5.  **Run Tests** (Optional)
    ```bash
    npm run test
    ```

---

## ✏️ How to Edit & Customize

### 1. Game Logic & Configuration
*   **Add/Edit Games**: Modify `data/games.ts`. This file contains the JSON definitions for all arcade games (pricing, visuals, upgrade trees).
*   **Game Templates**: The logic for specific game types (e.g., `simulation_tycoon`, `clicker_idle`) resides in `components/game-templates/`. Editing `SimulationTemplate.tsx` changes the behavior for *all* tycoon games.

### 2. Curriculum & Content
*   **Lessons**: Edit `data/curriculum.ts`. Each lesson follows the `UniversalLessonUnit` schema.
*   **Books**: Edit `data/libraryBooks.ts` to change the default library. In production, use the **Admin Dashboard** to add books dynamically.

### 3. Ads & Monetization
The application uses a simulated ad banner and paywall system.

*   **Ad Banner**:
    *   Located in `components/Layout.tsx`.
    *   Controlled by the `isIntern` check: `const isIntern = user.subscriptionTier === 'intern';`.
    *   **To Remove/Edit**: Search for `{isIntern && (` in `Layout.tsx`. You can change the text or styling of the footer banner there.

*   **Paywalls (Investor Pitch)**:
    *   The `InvestorPitchModal.tsx` component is the upgrade screen.
    *   It is triggered in various places (e.g., `UniversalBusinessGame.tsx` when energy runs out, `GameMenu.tsx` for locked games).
    *   **To Edit Pricing/Plans**: Modify `SUBSCRIPTION_PLANS` in `store.ts`.

### 4. Admin Panel
*   Access the Admin Dashboard by logging in with a user possessing the `ADMIN` role.
*   Use the **CMS Tab** to edit landing page text and create new custom marketing pages without touching code.

---

## 🦉 Meet Ollie (C.E.O.)

**Chief Education Officer**

> *"Hoot hoot! Failure is just market research for your next success!"*

Ollie is more than a mascot; he's a context-aware AI agent integrated into every aspect of the app. He provides hints in games, explains difficult words in lessons, and roleplays as a consultant for premium users.

---

## 📄 License

Distributed under the MIT License. Built for the Future Leaders of the World.
