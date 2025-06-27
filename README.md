# ResumAI

ResumAI is a full-stack AI-powered web app that helps job seekers tailor their resumes, generate personalized cover letters, and prepare for interviews — all based on real job listings.

## ✨ Features

- **Resume Optimizer**: Upload your resume (PDF) and a job URL — get an optimized version of your resume and a detailed before/after ATS score breakdown.
- **Cover Letter Generator**: Generate a tailored cover letter from your resume and a job posting.
- **Interview Question Generator**: Get 10 AI-generated practice interview questions based on a job listing.

---

## 🗂️ Project Structure

```
ResumAI/
├── Client/ # React + Vite frontend
├── Server/ # FastAPI backend
└── README.md # This file
```

## 🚀 Getting Started

### 🔧 Backend (FastAPI)

1. `cd` into the `Server` directory:
   - `cd Server`

2. Create a virtual environment (only if `.venv` doesn't already exist)
    - `python -m venv .venv`

3. Activate the virtual environment:
    - On Windows command prompt: `.venv\Scripts\activate`
    - On Windows PowerShell: `.venv\Scripts\Activate.ps1`
    - On macOS/Linux: `source .venv/bin/activate`

4. Install dependencies:
    - `pip install -r requirements.txt`

5. Create `.env` file
    - Create OpenAI API key and enter it into a `.env` file just like `.env.example` shows
    - Create `DATABASE_URL` with a cloud-based database host (I used Neon), and enter the connection string in the `.env` file

6. Run the backend server:
    - `uvicorn app.main:app --reload`

### 🖥️ Frontend (React + Vite)

1. `cd` into the Client directory:
    - `cd Client`

2. Install dependencies:
    - `npm install`

3. Run the development server:
    - `npm run dev`

## 🧪 Using the App

Once both servers are running, open your browser and navigate to the `localhost` URL.

1. **Resume Optimizer**

Upload your resume (PDF) and paste in a job posting URL. The app will:
- Extract and parse the resume and job description
- Generate an optimized version of your resume
- Show a comparison and ATS scores
- List the changes made

2. **Cover Letter Generator**
Upload your resume and a job URL, and get a personalized, job-specific cover letter instantly.

3. **Interview Question Generator**
Paste a job URL to get 10 AI-generated interview questions tailored to that specific role.

## 📦 Technologies Used

- **Frontend**: React, Vite, Tailwind CSS
- **Backend**: FastAPI, Pydantic, Uvicorn
- **AI Integration**: OpenAI (GPT models)
- **PDF Parsing**: PyMuPDF (fitz)
- **Database**: PostgreSQL (via Neon)
- **Hosting**: Vercel (frontend), TBD or local (backend)
