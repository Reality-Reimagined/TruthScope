cd backend
docker build -t video-analysis-api .
docker run -p 8000:8000 -v $(pwd)/logs:/app/logs video-analysis-api
