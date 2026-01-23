## Backend Setup and Usage

Follow the steps below to run the backend locally:

1. Create and activate a Python virtual environment.
2. Navigate to the `api` directory.
3. Install the required dependencies:
```bash
pip install -r requirements.txt
```
Create a .env file and configure the environment variables based on .env.example.

run
```bash
python3 -m model.Article
```
to create the tables inside the database

Start the FastAPI development server:
```bash
fastapi dev main.py
```