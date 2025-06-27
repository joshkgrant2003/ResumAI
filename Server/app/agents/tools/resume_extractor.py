import os
import fitz
from app.config import LOG_DIR

def extract_resume_pdf(pdf_path: str) -> str:
    print(f"Extracting text from {pdf_path}...")

    try:
        doc = fitz.open(pdf_path)
    except Exception as e:
        print(f"Could not open PDF file: {e}")
        raise
    
    text = ""
    for page in doc:
        text += page.get_text()
    
    if not text.strip():
        raise Exception("No extractable text found in PDF.")

    log_file = os.path.join(LOG_DIR, "resume_contents_logs.log")
    os.makedirs(LOG_DIR, exist_ok=True)
    with open(log_file, "w", encoding="utf-8") as f:
        f.write(text)

    print("STATUS: resume extracted successfully")
    return text