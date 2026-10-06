FROM python:3.11-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    UPLOAD_DIR=/app/uploads

WORKDIR /app

COPY requirements.txt /app/requirements.txt
RUN pip install --upgrade pip && pip install -r requirements.txt

COPY main.py /app/main.py
COPY app/db.py /app/app/db.py
COPY app/routers/auth.py app/routers/posters.py app/routers/sections.py /app/app/routers/
COPY app/schemas/poster.py app/schemas/section.py /app/app/schemas/
COPY app/utils/file_utils.py app/utils/pdf_thumbnail.py app/utils/qr.py /app/app/utils/

RUN addgroup --system --gid 10001 appuser \
    && adduser --system --uid 10001 --ingroup appuser appuser \
    && mkdir -p /app/uploads/posters /app/uploads/audio /app/uploads/qrcodes /app/uploads/thumbnails \
    && chown -R appuser:appuser /app/uploads

USER appuser

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
