# VeerSetu Counsellor Dashboard

Clinical case management, psychological debriefings, tele-support sessions, and confidential welfare records interface for India's Central Armed Police Forces (CAPF) mental health specialists and empanelled psychologists.

---

## ??? Tech Stack
- **Framework**: React 19, TypeScript
- **Bundler**: Vite
- **Styling**: Tailwind CSS
- **Icons & Animation**: Lucide React, Motion
- **API Client**: Modular API services connected to VeerSetu Central Backend API

---

## ?? Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment (.env)
```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_API_URL=http://localhost:5000
PORT=3001
```

### 3. Start Development Server
```bash
npm run dev
```
The counsellor dashboard will be live at `http://localhost:3001`.

---

## ?? Demo Credentials
- **Email**: `counsellor@veersetu.demo` (or `a.sharma@veersetu.nic.in`)
- **Password**: `VeerSetu@Demo2026`
- **Role**: `Counsellor`

---

## ?? Confidentiality & Medical Privacy
In compliance with CAPF medical ethics and mental health privacy standards:
- Clinical case notes created within this portal are marked `isConfidential: true`.
- These therapeutic observations, diagnoses, and psychiatric assessments remain strictly restricted to authorized counsellors and are automatically omitted from operational commander views.
