# 🚀 CareerPilot AI – AI-Powered Career Guidance Platform

CareerPilot AI is an intelligent career guidance platform designed to help students and early-career professionals identify suitable career opportunities, evaluate their job readiness, discover skill gaps, and build personalized learning roadmaps using Artificial Intelligence.

The application integrates Google's Gemini API to provide AI-driven career recommendations and structured learning guidance.

## ✨ Features

- **AI-Powered Career Analysis:** Analyzes user profiles, education, technical skills, and career interests.
- **Job Readiness Score:** Evaluates career readiness based on technical proficiency, market alignment, and portfolio readiness.
- **Personalized Career Recommendations:** Suggests suitable career paths based on individual skills and interests.
- **Skill Gap Analysis:** Identifies missing skills and recommends areas for improvement.
- **30-Day Learning Roadmap:** Generates a personalized day-by-day learning plan for the selected career role.
- **Weekly Learning Milestones:** Organizes learning activities into structured weekly phases.
- **AI Integration:** Uses Google's Gemini API to generate intelligent career insights and recommendations.
- **Firebase Integration:** Supports authentication and cloud-based application data management.

## 🛠️ Tech Stack

| Category | Technologies |
|---|---|
| Frontend | React.js, TypeScript |
| Styling | Tailwind CSS |
| Backend | Node.js, Express.js |
| AI Integration | Google Gemini API |
| Database | Firebase Firestore |
| Authentication | Firebase Authentication |
| Build Tool | Vite |
| Icons | Lucide React |
| Deployment Platform | Google Cloud Run |

## 🏗️ Project Architecture

The application follows a full-stack architecture:

1. **Frontend:** React and TypeScript provide the user interface.
2. **Backend:** Express.js handles API requests and application logic.
3. **AI Processing:** Gemini API analyzes user profiles and generates personalized career insights.
4. **Database:** Firebase Firestore supports cloud-based data storage.
5. **Authentication:** Firebase Authentication manages user sign-in.
6. **Deployment:** Google Cloud Run provides a cloud deployment environment.

## 📂 Project Structure

```text
ideathon-prototype/
│
├── assets/
│
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   └── ...
│
├── .env.example
├── .gitignore
├── firebase-applet-config.json
├── firebase-blueprint.json
├── firestore.rules
├── index.html
├── metadata.json
├── package.json
├── server.ts
├── tsconfig.json
└── vite.config.ts
```

## ⚙️ Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/NavithaSri21/ideathon-prototype.git
```

### 2. Navigate to the Project Directory

```bash
cd ideathon-prototype
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Configure Environment Variables

Create a `.env` file in the root directory.

```env
GEMINI_API_KEY=your_gemini_api_key
APP_URL=your_application_url
```

Add your Gemini API key securely. Never upload private API keys to GitHub.

Configure Firebase Authentication and Firestore using your Firebase project settings.

### 5. Run the Application

```bash
npm run dev
```

The development server will start at:

```text
http://localhost:3000
```

### 6. Build the Application

```bash
npm run build
```

## 🔮 Future Enhancements

- Resume analysis and optimization.
- Integration of real-time job opportunities.
- AI-powered interview preparation.
- Skill assessment and progress tracking.
- Personalized certification recommendations.
- Advanced career analytics and insights.

## 🎯 Project Objective

The primary objective of CareerPilot AI is to simplify career planning through artificial intelligence by providing personalized career recommendations, identifying skill gaps, and guiding users with structured learning paths.

## 👩‍💻 Developed By

**K. Navitha Sri**

AI & Data Science Graduate

GitHub: [NavithaSri21](https://github.com/NavithaSri21)

Project Repository: [ideathon-prototype](https://github.com/NavithaSri21/ideathon-prototype)

---

⭐ If you find this project useful, consider giving the repository a star!
