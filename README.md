
# KidCap HQ - Future CEO Academy 🚀

**KidCap HQ** is the world's #1 gamified business academy for kids. We turn screen time into real-world skills like entrepreneurship, financial literacy, and leadership through addictive mini-games, an RPG-style progression system, and AI-powered tutoring.

![KidCap HQ Banner](https://images.unsplash.com/photo-1556761175-5973dc0f32e7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80)

---

## 🌟 Key Features

### 🎓 Interactive Learning Engine
*   **Universal Lesson System**: 100+ gamified lessons covering Money Basics, Crypto, AI, and Global Trade.
*   **Ollie (AI Tutor)**: Powered by **Google Gemini 2.5**, Ollie provides real-time homework help, business advice, and cheeky bird puns.
*   **Book Library**: Read summaries of business classics like *Rich Dad Poor Dad* and *Shoe Dog* to earn XP.

### 🎮 The Universal Business Arcade
Runs on our custom `GameEngine.tsx` supporting multiple genres:
*   **Tycoon Sims**: Lemonade Stand, Coffee Cart, Factory Manager.
*   **Action/Arcade**: Pizza Rush (Phaser-based driving), Rhythm Car Wash.
*   **Puzzle/Logic**: Recycling Sorter, Fair Trade Matcher.
*   **Clicker/Idle**: App Developer, Dropship Empire.

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
*   **Subscription System**: Tiered access (Intern, Founder, Board Member, Tycoon).
*   **Energy Mechanics**: Freemium energy loops to encourage breaks (or upgrades).
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

## 🚀 Getting Started

### Prerequisites
*   Node.js (v18+)
*   Google Gemini API Key (for AI features)

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

4.  **Add Assets**
    Place your `ollie.png` image in the `public/` or root folder.

5.  **Run Development Server**
    ```bash
    npm run dev
    ```

---

## 📂 Project Structure

```
/
├── components/
│   ├── AdminDashboard.tsx       # CMS & User Management
│   ├── GameEngine.tsx           # Universal Game Launcher
│   ├── game-templates/          # Reusable Game Logic (Tycoon, Clicker, etc.)
│   ├── OllieChat.tsx            # AI Chat Interface
│   ├── TeacherDashboard.tsx     # Classroom Management
│   └── ...
├── data/
│   ├── curriculum.ts            # 100+ Lesson Definitions
│   ├── games.ts                 # Config for 30+ Games
│   └── libraryBooks.ts          # Book Database
├── locales/                     # i18n Translation Files
├── services/
│   ├── geminiService.ts         # AI Integration
│   └── stripeService.ts         # Mock Payment Gateway
├── store.ts                     # Global State (Zustand)
└── App.tsx                      # Main Router & Layout
```

---

## 🦉 Meet Ollie (C.E.O.)

**Chief Education Officer**

> *"Hoot hoot! Failure is just market research for your next success!"*

Ollie is more than a mascot; he's a context-aware AI agent integrated into every aspect of the app. He provides hints in games, explains difficult words in lessons, and roleplays as a consultant for premium users.

---

## 📄 License

Distributed under the MIT License. Built for the Future Leaders of the World.
