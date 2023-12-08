FROM python:3.11.2-slim

WORKDIR /app

# set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
ENV AppDir=/app
#ENV PYTHONPATH $AppDir

WORKDIR $AppDir

COPY . $AppDir

RUN pip install --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt

# https://docs.docker.com/config/containers/multi-service_container/
# RUN chmod +x ./run.sh
CMD ["python", "bot.py"]
