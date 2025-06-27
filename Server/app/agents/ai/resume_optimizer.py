import os
from app.config import OPENAI_API_KEY, LOG_DIR
from langchain_openai import ChatOpenAI
from langchain.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser

if not OPENAI_API_KEY:
    raise Exception("Configuration error: could not find environment variable for 'OPENAI_API_KEY'")

prompt_template = PromptTemplate(
    input_variables = ["resume_text", "job_description"],
    template =
    """
        You are a professional resume assistant with deep knowledge of how Applicant Tracking Systems (ATS) evaluate resumes based on keyword relevance.

        Given the following resume:

        {resume_text}

        And the following job description:

        {job_description}

        Your tasks:

        1. Rewrite and optimize the resume to better match the job, making it ATS-friendly.
        2. Explicitly incorporate relevant keywords and phrases from the job description into the experience, skills, and summary sections where appropriate — while keeping the content truthful and professional.
        3. Preserve formatting and clarity. Ensure the structure of the resume remains clean and easy to scan.
        4. At the end, include a section titled "Changes and Rationale" with a bulleted list of the most impactful changes made and why they improve keyword alignment or clarity.

        Output the improved resume in plain text format.
    """
)

llm = ChatOpenAI(api_key=OPENAI_API_KEY, temperature=0.7)

optimizer_chain = prompt_template | llm | StrOutputParser()

async def optimize_resume(resume_text: str, job_description: str) -> str:
    print("Optimizing resume...")

    if not resume_text.strip():
        raise Exception("Resume text is empty")
    elif not job_description.strip():
        raise Exception("Job description text is empty")
    
    try:
        optimized_resume = await optimizer_chain.ainvoke({
            "resume_text": resume_text,
            "job_description": job_description,
        })

        log_file = os.path.join(LOG_DIR, "optimized_resume_logs.log")
        os.makedirs(LOG_DIR, exist_ok=True)
        with open(log_file, "w", encoding="utf-8") as f:
            f.write(optimized_resume)

        print("STATUS: resume optimized successfully")
        return optimized_resume
    except Exception as e:
        print(f"LLM invocation failed: {e}")
        raise 