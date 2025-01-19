# backend/Dockerfile
FROM python:3.11-slim

WORKDIR /backend

# Copy only the backend requirements and install dependencies
COPY requirements.txt .
RUN pip install -r requirements.txt

# Copy only the backend code
COPY app.py .

# Command to run the application
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8080"]