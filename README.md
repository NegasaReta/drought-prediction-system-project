# Drought Prediction & Resilience System

A comprehensive environmental monitoring and predictive system leveraging AI to analyze drought risks and provide expert insights.

## Project Structure

- `backend/`: FastAPI application, database models, and API endpoints.
- `src/`: Next.js frontend with dynamic dashboards and interactive predictions.
- `main.py`: Entry point for the FastAPI server.

---

## Backend Setup

Follow these steps to set up and run the backend server locally.

### Prerequisites
- Python 3.10 or higher
- PostgreSQL (running locally or via connection string)

### Option 1: Using `uv` (Recommended)

1.  **Sync Dependencies**:
    ```bash
    uv sync
    ```
2.  **Environment Configuration**:
    Create a `.env` file in the `backend/` directory based on `backend/.env.example`.
3.  **Run Server**:
    ```bash
    uv run uvicorn main:app --reload
    ```

### Option 2: Using `pip`

1.  **Create Virtual Environment**:
    ```bash
    python -m venv .venv
    source .venv/bin/activate  # On Windows: .venv\Scripts\activate
    ```
2.  **Install Dependencies**:
    ```bash
    pip install -r backend/requirements.txt
    ```
3.  **Environment Configuration**:
    Create a `.env` file in the `backend/` directory based on `backend/.env.example`.
4.  **Run Server**:
    ```bash
    uvicorn main:app --reload
    ```

---

## Frontend Setup

Follow these steps to set up and run the Next.js frontend locally.

### Prerequisites
- Node.js 18.x or higher

### Installation & Development

Choose your preferred package manager:

#### Using `npm`
```bash
npm install
npm run dev
```

#### Using `pnpm`
```bash
pnpm install
pnpm dev
```

#### Using `yarn`
```bash
yarn install
yarn dev
```

#### Using `bun`
```bash
bun install
bun dev
```

The application will be available at [http://localhost:3000](http://localhost:3000) (or the port specified in your terminal).

---

## API Documentation

Once the backend is running, you can access the interactive API documentation at:
- Swagger UI: [http://localhost:8000/api/v1/docs](http://localhost:8000/api/v1/docs)
- Redoc: [http://localhost:8000/api/v1/redoc](http://localhost:8000/api/v1/redoc)

---

## License
&copy; 2025 Drought Prediction App • Empowering Sustainable Futures
