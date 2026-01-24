# 🌍 Drought Prediction & Resilience System

Welcome to the **Drought Prediction & Resilience System**! We're thrilled to have you here. 

This project is a powerful, AI-driven platform designed to monitor environmental conditions and provide real-time drought risk assessments. By merging advanced data analytics with an intuitive, modern user interface, we aim to empower communities, researchers, and policymakers to stay one step ahead of environmental challenges and protect our shared agricultural future.

---

## 🏗️ Project Structure

Explore the core components of our ecosystem:

-   **`backend/`**: A robust FastAPI application handling the logic, database models, and secure API endpoints.
-   **`src/`**: A cutting-edge Next.js frontend featuring dynamic dashboards and interactive prediction tools.
-   **`main.py`**: The central entry point to launch the backend server and its powerful underlying models.

---

## 🛠️ Backend Setup

Ready to power up the engine? Follow these steps to set up the backend server locally.

### Prerequisites
-   **Python 3.10** or higher
-   **PostgreSQL** (running locally or accessible via a connection string)

### Option 1: Using `uv` (Fastest & Recommended)

If you have [uv](https://github.com/astral-sh/uv) installed, setting up is a breeze:

1.  **Sync Dependencies**:
    ```bash
    uv sync
    ```
2.  **Configure Environment**:
    Create a `.env` file in the `backend/` directory, using `backend/.env.example` as your template.
3.  **Launch the Server**:
    ```bash
    uv run uvicorn main:app --reload
    ```

### Option 2: Using `pip` (Classic)

1.  **Create a Virtual Environment**:
    ```bash
    python -m venv .venv
    source .venv/bin/activate  # On Windows: .venv\Scripts\activate
    ```
2.  **Install Dependencies**:
    ```bash
    pip install -r backend/requirements.txt
    ```
3.  **Configure Environment**:
    Create a `.env` file in the `backend/` directory based on `backend/.env.example`.
4.  **Launch the Server**:
    ```bash
    uvicorn main:app --reload
    ```

---

## 🎨 Frontend Setup

Let's bring the data to life! Set up the Next.js frontend using your favorite package manager.

### Prerequisites
-   **Node.js 18.x** or higher

### Installation & Development

Choose the tool that fits your workflow:

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

The application will typically be live at [http://localhost:3000](http://localhost:3000). Enjoy the resilience!

---

## 📖 API Documentation

Our API is fully documented and interactive. Once your backend is running, dive in here:
-   **Swagger UI (Interactive)**: [http://localhost:8000/api/v1/docs](http://localhost:8000/api/v1/docs)
-   **Redoc**: [http://localhost:8000/api/v1/redoc](http://localhost:8000/api/v1/redoc)

---

## 📜 License
&copy; 2025 Drought Prediction App • Together for a Sustainable Future
