# Ledger — Monthly Expense & Income Tracker

A modern, responsive, and full-featured personal finance and budgeting web application built with **React**, **TypeScript**, **Tailwind CSS**, and **Firebase Firestore**.

Designed for tracking monthly cash flow, monitoring category spending caps, visualizing financial trends, and synchronizing data securely across devices in Indian Rupees (₹).

---

## ✨ Features

- **📊 Comprehensive Financial Dashboard**
  - Instant monthly KPIs: Total Income, Total Expenses, Net Savings, and Savings Rate.
  - Overall monthly budget progress bar and status alert banner.
  - Monthly selector with quick previous/next navigation and historical reviews.

- **🎯 Budget & Category Management**
  - Set custom spending limits on predefined and custom categories (Food, Housing, Utilities, Transportation, Entertainment, Health, Shopping, etc.).
  - Category breakdown with visual progress indicators: *On Track*, *Caution (≥80%)*, and *Over Budget*.
  - Monthly overall spending cap configuration.

- **📈 Visual Analytics & Reports**
  - Interactive expense distribution charts by category using Recharts.
  - Daily cash flow trends (cumulative expenses vs. income throughout the month).
  - Multi-column sortable category report table on desktop and responsive cards on mobile.

- **🧾 Transaction Ledger**
  - Filter by transaction type (All, Expense, Income), date range, and category.
  - Search transactions by description or note.
  - Quick inline actions for editing and deleting records.
  - CSV export for spreadsheets and offline backup.

- **📱 Mobile-First Responsive Design**
  - Persistent mobile bottom navigation bar for one-thumb access (Overview, Ledger, Reports, Budgets).
  - Floating action center button for quick transaction additions.
  - Adaptive bottom-sheet modals for touch devices.

- **☁️ Cloud Sync & Persistence**
  - Dual-mode architecture: Works seamlessly in offline/local storage mode with pre-seeded demo data.
  - Integrated **Firebase Authentication** (Google Sign-In & Anonymous Guest mode).
  - **Firebase Cloud Firestore** real-time bidirectional synchronization for multi-device data persistence.

---

## 🛠️ Tech Stack

- **Framework**: [React 18](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Charts**: [Recharts](https://recharts.org/)
- **Database & Auth**: [Firebase Firestore](https://firebase.google.com/docs/firestore) & [Firebase Authentication](https://firebase.google.com/docs/auth)
- **Animation**: [Motion](https://motion.dev/)

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (version 18 or higher recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/) or [bun](https://bun.sh/)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/dhanavathsrikanth/ledger.git
   cd ledger
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Firebase (Optional for cloud sync)**:
   - Create a Firebase project at the [Firebase Console](https://console.firebase.google.com/).
   - Enable **Firestore Database** and **Authentication** (Google & Anonymous providers).
   - Configure your Firebase credentials in `firebase-applet-config.json` or `.env`.

4. **Start the development server**:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) (or the port specified in your console) in your browser.

---

## 📦 Build & Production

To build the project for production:

```bash
npm run build
```

The compiled static assets will be located in the `dist/` directory, ready to be deployed to Cloud Run, Vercel, Firebase Hosting, Netlify, or GitHub Pages.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
