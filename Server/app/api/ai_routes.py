from fastapi import APIRouter, UploadFile, File, Form
from fastapi.responses import JSONResponse
from app.errors import JobBlockedException, JobParsingException
from app.agents.tools.url_scraper import scrape_url
from app.agents.ai.job_text_parser import parse_job_description
from app.agents.tools.resume_extractor import extract_resume_pdf
from app.agents.tools.resume_scorer import keyword_match_score
from app.agents.ai.resume_optimizer import optimize_resume
from app.agents.ai.cover_letter_generator import generate_cover_letter
from app.agents.ai.interview_question_generator import generate_interview_questions
import tempfile

ai_router = APIRouter()

@ai_router.post("/optimize_resume/")
async def optimize_resume_route(
    job_url: str = Form(...), 
    resume: UploadFile = File(...)
):
    print("POST request received at '/optimize_resume/' route")

    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
            content = await resume.read()
            tmp.write(content)
            resume_path = tmp.name
        
        url_raw_text = await scrape_url(job_url)
        job_description = await parse_job_description(url_raw_text)
        resume_text = extract_resume_pdf(resume_path)
        unoptimized_score = keyword_match_score(resume_text, job_description, top_k=20)
        optimized_resume = await optimize_resume(resume_text=resume_text, job_description=job_description)
        optimized_score = keyword_match_score(optimized_resume, job_description, top_k=20)

        print("Resume optimized successfully!")
        return {
            "optimized_resume": optimized_resume,
            "unoptimized_score": unoptimized_score,
            "optimized_score": optimized_score,
        }
    
    except JobBlockedException as e:
        return JSONResponse(status_code=400, content={"error": "job_blocked", "detail": str(e)})

    except JobParsingException as e:
        return JSONResponse(status_code=422, content={"error": "job_parsing_failed", "detail": str(e)})

    except Exception as e:
        return JSONResponse(status_code=500, content={"error": "internal_server_error", "detail": str(e)})


@ai_router.post("/generate_cover_letter/")
async def generate_cover_letter_route(
    job_url: str = Form(...),
    resume: UploadFile = File(...)
):
    print("POST request received at '/generate_cover_letter/' route")

    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
            content = await resume.read()
            tmp.write(content)
            resume_path = tmp.name
        
        url_raw_text = await scrape_url(job_url)
        job_description = await parse_job_description(url_raw_text)
        resume_text = extract_resume_pdf(resume_path)
        cover_letter = await generate_cover_letter(resume_text=resume_text, job_description=job_description)
        
        print("Cover letter generated successfully!")
        return {"cover_letter": cover_letter}
    
    except JobBlockedException as e:
        return JSONResponse(status_code=400, content={"error": "job_blocked", "detail": str(e)})

    except JobParsingException as e:
        return JSONResponse(status_code=422, content={"error": "job_parsing_failed", "detail": str(e)})

    except Exception as e:
        return JSONResponse(status_code=500, content={"error": "internal_server_error", "detail": str(e)})


@ai_router.post("/generate_interview_questions/")
async def generate_interview_questions_route(
    job_url: str = Form(...),
):
    print("POST request received at '/generate_interview_questions/' route")

    try:
        url_raw_text = await scrape_url(job_url)
        job_description = await parse_job_description(url_raw_text)
        interview_questions = await generate_interview_questions(job_description=job_description)

        print("Interview questions generated successfully!")
        return {"interview_questions": interview_questions}
    
    except JobBlockedException as e:
        return JSONResponse(status_code=400, content={"error": "job_blocked", "detail": str(e)})

    except JobParsingException as e:
        return JSONResponse(status_code=422, content={"error": "job_parsing_failed", "detail": str(e)})

    except Exception as e:
        return JSONResponse(status_code=500, content={"error": "internal_server_error", "detail": str(e)})
    