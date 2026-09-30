# SafeTour — Smart Crowd Safety Management System

[![Smart India Hackathon](https://img.shields.io/badge/SIH-Project-blue?style=for-the-badge&logo=gov.in)](https://www.sih.gov.in/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS_v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

> **An AI-powered crowd safety and tourist management platform developed for Smart India Hackathon (SIH)**. SafeTour provides real-time crowd density telemetry, predictive surge analytics, geo-fenced safety corridors, automated hazard broadcast alerts, and an instant 1-tap SOS emergency dispatch system.

---

## 📌 Problem Statement & Overview

Tourist hubs, religious pilgrimage corridors, and heritage landmarks often experience dangerous crowd surges and bottleneck stampede risks without warning. Traditional security mechanisms rely on reactive intervention rather than predictive mitigation.

**SafeTour** bridges this gap through a unified web and mobile interface that equips tourists and municipal command centers with:
- **Visual Crowd Heatmaps**: Color-coded sector occupancy (<40% Safe, 40–75% Moderate, >75% Surge Risk).
- **Proactive AI Forecasting**: Machine learning projections on impending footfall peaks up to 5 hours in advance.
- **Dynamic Geo-Fencing**: Virtual perimeters preventing accidental incursions into restricted heritage zones.
- **Rapid SOS Dispatch Station**: 5-second countdown with audible siren, GPS coordinate telemetry, and direct links to emergency response agencies (`112`, `100`, `108`, `101`, `1363`).
- **Cryptographic Tourist Credential**: Tamper-proof digital identity storing emergency next-of-kin contacts, blood group, and QR code access passes.

---

## 🚀 Key Features

### 1. 🗺️ Real-Time Crowd Density Heatmap
- Live sector monitoring across high-footfall tourist zones.
- Clickable zone inspection showing live headcount, capacity limits, and crowd movement vectors (*rising*, *stable*, *declining*).
- Dynamic alternate route recommendations to divert tourists away from bottlenecks.

### 2. 🚨 Intelligent Safety Alert Broadcast Center
- Categorized risk bulletins (`Danger`, `Warning`, `Info`).
- One-click acknowledgement, read-state tracking, and sensor test simulation.

### 3. 🆘 Emergency SOS Dispatch Station
- Prominent SOS trigger with a safety grace cancellation countdown.
- Synthesized Web Audio siren alarm.
- Automatic GPS breadcrumb broadcast (`Latitude`, `Longitude`, `Altitude`, `Accuracy`).
- Instant dialer integration for National Emergency `112`, Police `100`, Ambulance `108`, Fire `101`, and Tourist Helpline `1363`.

### 4. 📈 Predictive Crowd Analytics
- Interactive hour-by-hour forecast bar graph.
- "Best Window to Visit" recommendation engine to maximize tourist comfort and minimize congestion.

### 5. 📍 Geo-Fencing & Live Location Sharing
- Real-time GPS coordinate simulation with meter-level accuracy.
- Safe corridor boundary alerts when approaching restricted perimeters.
- Emergency check-in ping broadcast to verified contacts.

### 6. 🪪 Blockchain & Verified Tourist Credentials
- Profile management for medical details (Blood group, allergies) and primary SOS contacts.
- Digital verification badge and scannable QR pass for fast-track entry turnstiles.

---

## 🛠️ Tech Stack

- **Frontend Framework**: React 19, TypeScript
- **Build Tool**: Vite 8
- **Styling**: Tailwind CSS v4, Custom CSS Animations
- **Icons**: Lucide React
- **Audio Synthesis**: Web Audio API (real-time emergency oscillator siren)
- **Deployment Target**: Cloud Run / Vercel / GitHub Pages

---

## 📦 Getting Started

### Prerequisites
- Node.js (v18.0.0 or higher)
- npm or yarn

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/<YOUR-USERNAME>/<YOUR-REPO-NAME>.git
   cd <YOUR-REPO-NAME>
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the local development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

4. **Build for production:**
   ```bash
   npm run build
   ```

---

## 🏛️ System Architecture

```text
┌─────────────────┐       ┌───────────────────────────┐       ┌──────────────────────┐
│  Tourist Client │ <---> │ SafeTour Edge Application │ <---> │  Municipal Command   │
│  (Mobile / Web) │       │ (Crowd Heatmap & AI Radar)│       │  & Police Dispatch   │
└─────────────────┘       └───────────────────────────┘       └──────────────────────┘
        │                               │                                 │
        ▼                               ▼                                 ▼
┌─────────────────┐       ┌───────────────────────────┐       ┌──────────────────────┐
│ Real-Time GPS & │       │ Predictive Crowd Forecast │       │ Emergency Responders │
│ Geo-Fence Alert │       │ Machine Learning Engine   │       │ (112 / 100 / 108)    │
└─────────────────┘       └───────────────────────────┘       └──────────────────────┘
```

---

## 👥 Hackathon Team & Acknowledgements

- **Event**: Smart India Hackathon (SIH)
- **Theme**: Travel & Tourism / Smart Automation & Public Safety
- **Lead Developer**: Abhiram Sikakolli

---

## 📄 License

This project is licensed under the Apache 2.0 License.
