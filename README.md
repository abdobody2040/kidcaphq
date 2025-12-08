# KidCap HQ - Future CEO Academy 🚀

**KidCap HQ** is a gamified EdTech platform designed to teach entrepreneurship, financial literacy, and business skills to kids aged 6-14. It combines interactive lessons, business simulation mini-games, and an RPG-style progression system to make learning addictive and fun.

![KidCap HQ Banner](https://via.placeholder.com/1200x400.png?text=KidCap+HQ+Screenshot)

## 🌟 Features

### 🎓 Interactive Learning Engine
*   **100+ Lessons**: Covers Money Basics, Marketing, Investing, Coding, and more.
*   **Gamified Quizzes**: Earn XP and BizCoins for correct answers.
*   **AI Tutoring**: Integrated with Google Gemini ("Owly") to explain complex topics simply.

### 🎮 Business Arcade
*   **Lemonade Tycoon**: Manage inventory, weather, and pricing.
*   **Pizza Rush**: A Phaser-based logistics game teaching efficiency.
*   **Brand Builder**: A creative tool to design company logos.
*   **Universal Simulation Engine**: Supports 30+ scenarios (YouTuber, Space Startup, Pet Grooming) with dynamic markets and upgrade trees.

### 🏆 Gamification & Progression
*   **My Empire**: Upgrade your HQ from a "Messy Garage" to a "Private Island".
*   **MBA Skill Tree**: Unlock passive buffs (Charisma, Efficiency, Wisdom).
*   **Portfolio**: Hire managers to earn idle income while offline.
*   **Leaderboards**: Compete weekly with other "Kidpreneurs".
*   **Avatar Shop**: Customize your look with hats, suits, and accessories.

### 🛡️ Safety & Control
*   **Parent Dashboard**: Monitor screen time, progress, and toggle sound/music.
*   **Teacher Mode**: Manage classrooms, lock/unlock curriculum modules.
*   **Privacy First**: Uses masked usernames and avatars.

---

## 🛠️ Tech Stack

*   **Frontend**: React 19, TypeScript, Vite
*   **Styling**: Tailwind CSS, Framer Motion
*   **State Management**: Zustand (with LocalStorage persistence)
*   **Game Engine**: Phaser 3 (integrated via React refs)
*   **AI**: Google GenAI SDK (Gemini 2.5 Flash)
*   **Icons**: Lucide React

---

## 🚀 Getting Started (Development)

Follow these steps to run the project locally.

### Prerequisites
*   Node.js (v18 or higher)
*   npm or yarn

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
    Create a `.env` file in the root directory and add your Google Gemini API Key:
    ```env
    API_KEY=your_google_gemini_api_key_here
    ```

4.  **Run the development server**
    ```bash
    npm run dev
    ```
    Open `http://localhost:5173` in your browser.

---

## 📦 Building for Production

To deploy the app, you need to create an optimized production build.

1.  **Clean up `index.html` (Optional)**
    *   The dev version uses a Tailwind CDN script for quick prototyping.
    *   For production, remove the `<script src="https://cdn.tailwindcss.com"></script>` line from `index.html` as the build process handles CSS via `styles.css`.

2.  **Run the build command**
    ```bash
    npm run build
    ```
    This creates a `dist/` folder containing the compiled HTML, CSS, and JavaScript.

3.  **Preview the build**
    ```bash
    npm run preview
    ```

4.  **Deploy**
    *   Upload the contents of the `dist/` folder to any static host (Vercel, Netlify, GitHub Pages, Firebase Hosting).

---

## 📂 Project Structure

```
/
├── components/         # React Components
│   ├── UniversalBusinessGame.tsx  # Core Simulation Engine
│   ├── UniversalLessonEngine.tsx  # Core Learning Engine
│   ├── KidMap.tsx                 # Adventure Path UI
│   ├── LemonadeStand.tsx          # Custom Mini-Game
│   └── ...
├── data/               # Static Data & Content
│   ├── curriculum.ts   # Lesson Database (100+ units)
│   └── games.ts        # Game Definitions (30+ scenarios)
├── services/           # External Services
│   ├── geminiService.ts   # AI Integration
│   └── SoundService.ts    # Audio Synthesis
├── store.ts            # Global State (Zustand)
├── types.ts            # TypeScript Interfaces
├── App.tsx             # Main Router & Layout
├── index.tsx           # Entry Point
├── styles.css          # Global Styles
└── ...config files
```

---

## 🤝 Contributing

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
