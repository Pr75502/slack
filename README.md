# 🚀 Modern Slack Clone

A high-performance, real-time messaging application inspired by Slack, built with **React 19**, **Redux Toolkit**, **Firebase**, and **Tailwind CSS v4**.

![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS_v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)
![Redux](https://img.shields.io/badge/Redux_Toolkit-764ABC?style=for-the-badge&logo=redux&logoColor=white)
![React](https://img.shields.io/badge/React_19-61DAFB?style=for-the-badge&logo=react&logoColor=black)

---

## ✨ Features

- **🔐 Secure Authentication:** Seamless Sign Up and Login powered by Firebase Auth.
- **💬 Real-time Messaging:** Instant message delivery and updates using Firestore.
- **📁 Channel Management:** Create, delete, and switch between channels easily.
- **✍️ Inline Editing:** Edit your messages directly in the chat bubble with a modern UI.
- **⚡ Typing Indicators:** See who's typing in real-time.
- **🟢 User Presence:** Live online/offline status indicators for all users.
- **🎨 Modern Dark UI:** A sleek, Slack-inspired dark theme built with Tailwind CSS v4.
- **📱 Responsive Layout:** Optimized for various screen sizes with a layered sidebar design.

## 🛠️ Tech Stack

- **Frontend:** React 19 (Vite)
- **State Management:** Redux Toolkit
- **Styling:** Tailwind CSS v4 (using the `@tailwindcss/vite` plugin)
- **Backend/Database:** Firebase Firestore
- **Auth:** Firebase Authentication

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/)

### Installation

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd slack-clone
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Firebase Configuration:**
   Create a file named `src/firebase.js` (or update existing) with your Firebase credentials:
   ```javascript
   import { initializeApp } from "firebase/app";
   import { getAuth } from "firebase/auth";
   import { getFirestore } from "firebase/firestore";

   const firebaseConfig = {
     apiKey: "YOUR_API_KEY",
     authDomain: "YOUR_AUTH_DOMAIN",
     projectId: "YOUR_PROJECT_ID",
     storageBucket: "YOUR_STORAGE_BUCKET",
     messagingSenderId: "YOUR_SENDER_ID",
     appId: "YOUR_APP_ID"
   };

   const app = initializeApp(firebaseConfig);
   export const auth = getAuth(app);
   export const db = getFirestore(app);
   ```

### Running the App

Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

## 📦 Project Structure

```text
src/
├── assets/          # Static assets
├── components/      # React components (MainApp, MessageList, etc.)
├── features/        # Redux slices (auth, channels, messages, users)
├── redux/           # Store configuration
├── firebase.js      # Firebase initialization
├── index.css        # Tailwind imports and global styles
└── main.jsx         # Entry point
```

## 📜 License

This project is open-source and available under the [MIT License](LICENSE).
