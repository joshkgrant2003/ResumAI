from app.config import OPENAI_API_KEY
from app.errors import JobBlockedException, JobParsingException
from langchain_openai import ChatOpenAI
from langchain.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser

if not OPENAI_API_KEY:
    raise Exception("Configuration error: could not find environment variable for 'OPENAI_API_KEY'")

prompt_template = PromptTemplate(
    input_variables = ["url_raw_text"],
    template ="""
        You are a professional assistant that extracts structured job description information from a raw text blob of a web page.

        Given the following page text:

        {url_raw_text}

        Extract and return the following fields in plain text format:
        - Job Title
        - Company Name
        - Location
        - Job Responsibilities
        - Required Qualifications / Skills
        - Preferred Qualifications (if available)
        - Benefits (if mentioned)
        - How to Apply (if mentioned)

        Make the output clean and easy to read, use bullet points where appropriate, and omit any unrelated information.

        If a field is not provided or cannot be reasonably determined, say:  
        **"Field: Not provided"** (e.g., "Job Title: Not provided").

        Only write **"ERROR OCCURRED"** at the top **if**:
        - The content is clearly a CAPTCHA, login page, access denied, or generic security block.
        - OR the page contains **no discernible job description content** after reasonable analysis.

        When writing "ERROR OCCURRED", follow it with a short explanation like:
        - "Access denied or security redirect"
        - "Detected CAPTCHA or login wall"
        - "Page does not contain job content"
        - "Page said to wait for redirect"

        Do not write "ERROR OCCURRED" if the job description is incomplete but partially readable — instead, just use "Field: Not provided" (ex. "Company name: not provided") where needed.
    """
)

llm = ChatOpenAI(temperature=0.3)

job_parser_chain = prompt_template | llm | StrOutputParser()

async def parse_job_description(url_raw_text: str) -> str:
    if not url_raw_text.strip():
        raise JobParsingException("Raw text is empty")
    
    print("Parsing raw URL text...")

    try:
        parsed_output = await job_parser_chain.ainvoke({"url_raw_text": url_raw_text})

        if "error occurred" in parsed_output.lower():
            raise JobBlockedException("Job page was likely blocked or redirected to a security page.")
        elif (
            "job title: not provided" in parsed_output.lower()
            and "company name: not provided" in parsed_output.lower()
            and "job responsibilities: not provided" in parsed_output.lower()
        ):
            raise JobParsingException("Job description format unrecognized — failed to extract required fields.")

        print("STATUS: job description parsed successfully")
        return parsed_output
    
    # we want to send specific messages to front-end for these errors
    except (JobParsingException, JobBlockedException) as e:
        raise e 

    except Exception as e:
        raise JobParsingException(str(e))
    
    finally:
        with open("app/logs/job_parser_logs.log", "w", encoding="utf-8") as f:
            f.write(parsed_output)