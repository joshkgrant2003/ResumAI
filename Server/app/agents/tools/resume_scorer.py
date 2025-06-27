import os
import re
from collections import Counter
import string
import nltk
from nltk.corpus import stopwords
from app.config import LOG_DIR

nltk.download('stopwords')

stops = set(stopwords.words('english'))

def clean_text(text):
    text = text.lower()
    text = re.sub(r'\d+', '', text)
    return text.translate(str.maketrans('', '', string.punctuation))

def extract_keywords(text, top_k=20):
    text = clean_text(text)
    words = text.split()
    words = [word for word in words if word not in stops]
    return [word for word, _ in Counter(words).most_common(top_k)]

def keyword_match_score(resume_text, job_description, top_k=20):
    job_keywords = extract_keywords(job_description, top_k)
    resume_words = clean_text(resume_text).split()
    matched_keywords = [kw for kw in job_keywords if kw in resume_words]

    score = (len(matched_keywords) / len(job_keywords)) * 100

    log_file = os.path.join(LOG_DIR, "resume_scorer_logs.log")
    os.makedirs(LOG_DIR, exist_ok=True)
    with open(log_file, "w", encoding="utf-8") as f:
        f.write(f"Matched Keywords: {set(matched_keywords)}\n")
        f.write(f"Job Keywords: {job_keywords}\n")
        f.write(f"Score: {score:.2f}\n")

    return round(score, 2)