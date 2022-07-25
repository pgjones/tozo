FROM node:18-bullseye-slim as frontend

WORKDIR /frontend/
COPY frontend/package.json frontend/package-lock.json /frontend/
RUN npm install

COPY frontend /frontend/
RUN npm run build

FROM python:3.10.1-slim-bullseye

RUN apt-get update && apt install dumb-init
ENTRYPOINT ["/usr/bin/dumb-init", "--"]

EXPOSE 8080
RUN mkdir -p /app
WORKDIR /app
COPY hypercorn.toml /app/
CMD ["pdm", "run", "hypercorn", "--config", "hypercorn.toml", "backend.run:app"]

RUN python -m venv /ve
ENV PATH=/ve/bin:${PATH}
RUN pip install --no-cache-dir pdm

COPY backend/pdm.lock backend/pyproject.toml /app/
RUN pdm install --prod --no-lock --no-editable

COPY --from=frontend /frontend/build/*.js* /app/backend/static/
COPY --from=frontend /frontend/build/*.png /frontend/build/*.svg /app/backend/static/
COPY --from=frontend /frontend/build/index.html \
    /app/backend/templates/
COPY --from=frontend /frontend/build/static/. /app/backend/static/

COPY backend/src/ /app/

USER nobody
