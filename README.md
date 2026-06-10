# QR-Play: Interactive Poster Gallery

This repo contains a scaffold for the backend (FastAPI) and a starter frontend (Vite + React + Tailwind) for the QR-Play project.

Backend quick start:

1. Create a Python environment (Python 3.10+)
2. Install dependencies (example using pip):

```bash
pip install fastapi uvicorn python-multipart passlib[bcrypt] pyjwt PyMuPDF qrcode aiofiles Pillow
```

3. Copy `.env.example` to `.env` and set secure values (secret, admin hashed password).
4. Run the app:

```bash
uvicorn backend.main:app --reload --port 8000
```

Frontend scaffold is under `frontend/` with Vite + React + Tailwind starter files.
# Poster-Gallery