import httpx
from bs4 import BeautifulSoup, Comment
from app.errors import JobScrapingException, JobBlockedException

HEADERS = {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:98.0) Gecko/20100101 Firefox/98.0",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
        "Accept-Encoding": "gzip, deflate",
        "Connection": "keep-alive",
        "Upgrade-Insecure-Requests": "1",
        "Sec-Fetch-Dest": "document",
        "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-Site": "none",
        "Sec-Fetch-User": "?1",
        "Cache-Control": "max-age=0",
}

def is_visible(element):
    if element.parent.name in ['style', 'script', 'head', 'title', 'meta', '[document]'] or isinstance(element, Comment):
        return False
    return True

async def scrape_url(url: str) -> str:
    print(f"Scraping {url}...")

    try:
        async with httpx.AsyncClient() as client:
            res = await client.get(url, headers=HEADERS)
            res.raise_for_status()
    except httpx.HTTPStatusError as e:
        print(f"HTTP error while fetching job description: {e.response.status_code} - {e.response.text}")
        raise JobBlockedException(f"HTTP error: {e.response.status_code}")
    except httpx.RequestError as e:
        print(f"Request error while fetching job description: {e}")
        raise JobScrapingException("Error fetching job description")
    except Exception as e:
        print(f"General error during scrape_url: {e}")
        raise
    
    soup = BeautifulSoup(res.text, 'html.parser')
    text = soup.find_all(string=True)
    valid_text = filter(is_visible, text)

    full_text = ' '.join(t.strip() for t in valid_text if t.strip())

    if not full_text.strip():
        raise Exception("Extracted text is empty or not readable")

    with open("app/logs/raw_text_logs.log", "w", encoding="utf-8") as f:
        f.write(full_text)

    print("STATUS: URL scraped successfully")
    return full_text
