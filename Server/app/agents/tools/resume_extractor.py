import fitz

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

    with open("app/logs/resume_contents_logs.log", "w", encoding="utf-8") as f:
        f.write(text)

    print("STATUS: resume extracted successfully")
    return text