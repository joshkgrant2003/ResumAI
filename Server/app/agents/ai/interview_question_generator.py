from app.config import OPENAI_API_KEY
from langchain_core.runnables import RunnableLambda
from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate

if not OPENAI_API_KEY:
    raise Exception("Configuration error: could not find environment variable for 'OPENAI_API_KEY'")

prompt = ChatPromptTemplate.from_template(
    """
        You are an assistant that generates interview questions for job candidates.
        Using the provided job description, generate a list of 10 potential interview questions (a mix of behavioral, technical, and role-specific).

        Job Description:
        {job_description}

        Interview Questions:
    """
)

llm = ChatOpenAI(api_key=OPENAI_API_KEY, temperature=0.7)

generate_interview_questions_chain = (
    prompt | llm | RunnableLambda(lambda x: x.content)
)

async def generate_interview_questions(job_description: str) -> str:
    print("Generating cover letter...")

    if not job_description.strip():
        raise Exception("Job description text is empty")
    
    try:
        interview_questions = await generate_interview_questions_chain.ainvoke({
            "job_description": job_description,
        })

        with open("app/logs/interview_question_logs.log", "w", encoding="utf-8") as f:
            f.write(interview_questions)

        print("STATUS: interview questions generated successfully")
        return interview_questions
    except Exception as e:
        print(f"LLM invocation failed: {e}")
        raise 