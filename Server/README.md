# ResumAI

## Getting Started

1. `cd` into the `Server` directory
2. Activate the virtual environment by running:
    - On Windows command prompt: `.venv\Scripts\activate`
    - On Windows PowerShell: `.venv\Scripts\Activate.ps1`
    - On macOS/Linux: `source .venv/bin/activate`
3. Run `pip install -r requirements.txt` to get all dependencies
4. Create `.env` file
    - Create OpenAI API key and enter it into a `.env` file just like `.env.example` shows
    - Create `DATABASE_URL` with a cloud-based database host (I used Neon), and enter the connection string in the `.env` file
5. Run `uvicorn app.main:app --reload` to run the server
6. Run the web app and have fun!