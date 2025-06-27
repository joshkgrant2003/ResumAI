from app.config import OPENAI_API_KEY
from langchain_core.runnables import RunnableLambda
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate

if not OPENAI_API_KEY:
    raise Exception("Configuration error: could not find environment variable for 'OPENAI_API_KEY'")

prompt = ChatPromptTemplate.from_template(
    """
        You are an assistant that writes professional and personalized cover letters.
        Given the job description and a candidate's resume text, write a tailored cover letter that aligns with the job requirements and the candidate's experience.

        Resume:
        {resume_text}

        Job Description:
        {job_description}

        Cover Letter:
    """
)

llm = ChatOpenAI(api_key=OPENAI_API_KEY, temperature=0.7)

generate_cover_letter_chain = (
    prompt | llm | RunnableLambda(lambda x: x.content)
)

async def generate_cover_letter(resume_text: str, job_description: str) -> str:
    print("Generating cover letter...")

    if not resume_text.strip():
        raise Exception("Resume text is empty")
    elif not job_description.strip():
        raise Exception("Job description text is empty")
    
    try:
        cover_letter = await generate_cover_letter_chain.ainvoke({
            "resume_text": resume_text,
            "job_description": job_description,
        })

        with open("app/logs/cover_letter_logs.log", "w", encoding="utf-8") as f:
            f.write(cover_letter)

        print("STATUS: cover letter generated successfully")
        return cover_letter
    except Exception as e:
        print(f"LLM invocation failed: {e}")
        raise 