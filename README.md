
# KidCap HQ - Future CEO Academy 🚀

**KidCap HQ** is the world's #1 gamified business academy for kids. We turn screen time into real-world skills like entrepreneurship, financial literacy, and leadership through addictive mini-games and an RPG-style progression system.

![KidCap HQ Banner](https://via.placeholder.com/1200x400.png?text=KidCap+HQ+Screenshot)

## 🦉 Meet Your C.E.O. (Chief Education Officer)

**Ollie the Wise Owl**

> *"Hoot hoot! Mistakes are just tuition for success! Let's build your empire!"*

<img src="ollie.png" alt="Ollie the Wise Owl" width="200" style="border-radius: 20px; border: 4px solid #FFC800; box-shadow: 0 4px 6px rgba(0,0,0,0.1);" />

*   **Role:** Personal AI Tutor & Mentor
*   **Education:** Graduate of **Owl-vard Business School** 🎓
*   **Style:** Sharp Navy Blazer, crisp white shirt, and a backpack full of blueprints.
*   **Personality:** Optimistic, patient, and loves a good bird pun.
*   **Function:** Ollie lives in the app (bottom right corner!) to answer questions, explain complex math, and cheer you on.

---

## 🌟 Features

### 🎓 Interactive Learning Engine
*   **100+ Gamified Lessons**: From "The History of Money" to "Crypto & Space Biz".
*   **AI Chatbot (Ollie)**: A persistent, personality-driven AI companion available on every screen. Ask him anything!
*   **Smart Quizzes**: Earn XP and BizCoins for correct answers.

### 🎮 Business Arcade
*   **Lemonade Tycoon**: The classic start. Manage weather, inventory, and pricing.
*   **Pizza Rush**: A Phaser-based delivery game teaching logistics and time management.
*   **Brand Builder**: Design your own company logo, pick colors, and save your brand identity.
*   **Universal Simulation Engine**: Supports 30+ scenarios (YouTuber, Pet Salon, Robot Factory).

### 🏆 Gamification & Progression
*   **My Empire**: Upgrade your HQ from a "Messy Garage" to a "Private Island".
*   **MBA Skill Tree**: Unlock passive buffs like "Silver Tongue" (Charisma) or "Fast Hands" (Efficiency).
*   **Portfolio**: Hire managers to earn idle income while offline.
*   **Leaderboards**: Compete weekly with other "Kidpreneurs".
*   **Avatar Shop**: Customize your look with hats, suits, and accessories.

### 🛡️ Safety & Control
*   **Parent Dashboard**: Monitor screen time, progress, and toggle sound/music.
*   **Teacher Mode**: Manage classrooms, lock/unlock curriculum modules.
*   **Privacy First**: Uses masked usernames and avatars.

---

## 🏗️ Architecture & Scalability

KidCap HQ is built as a **Client-Side Single Page Application (SPA)**. This ensures maximum privacy (data stays on the device) and offline capability.

| Component | Capacity / Limit | Notes |
| :--- | :--- | :--- |
| **Global Users** | **Unlimited** | Served via CDN. No central database bottleneck. |
| **Local Profiles** | **~50 per Device** | Data stored in `localStorage` (Max 5MB). |
| **AI Tutor** | **~15 RPM (Free Tier)** | Limited by Google Gemini API quotas. Upgrade to Paid Tier for scale. |
| **Offline Mode** | **100% Supported** | Core gameplay works without internet (except AI features). |

> **Note:** Because there is no backend database, user progress is not synced between devices. A user on an iPad cannot continue their game on a Laptop.

---

## 🛠️ Tech Stack

*   **Frontend**: React 19, TypeScript, Vite
*   **Styling**: Tailwind CSS, Framer Motion
*   **State Management**: Zustand (Persistence Middleware)
*   **Game Engine**: Phaser 3
*   **AI**: Google GenAI SDK (Gemini 2.5 Flash)
*   **Icons**: Lucide React

---

## 🚀 Getting Started

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
    Create a `.env` file and add your Google Gemini API Key:
    ```env
    API_KEY=your_google_gemini_api_key_here
    ```

4.  **Add Ollie's Picture**
    Place your image of Ollie in the root folder and name it `ollie.png`.

5.  **Run the development server**
    ```bash
    npm run dev
    ```

---

## 📂 Project Structure

```
/
├── components/         
│   ├── OllieChat.tsx              # The AI Chatbot Component
│   ├── UniversalBusinessGame.tsx  # Core Simulation Engine
│   ├── UniversalLessonEngine.tsx  # Core Learning Engine
│   ├── KidMap.tsx                 # Adventure Path UI
│   └── ...
├── data/               
│   ├── curriculum.ts   # Lesson Database (100+ units)
│   └── games.ts        # Game Definitions (30+ scenarios)
├── services/           
│   ├── geminiService.ts   # AI Integration (Ollie's Brain)
│   └── SoundService.ts    # Audio Synthesis
├── store.ts            # Global State (Zustand)
├── App.tsx             # Main Router
└── README.md
```

---

## 📄 License

Distributed under the MIT License.
