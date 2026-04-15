# Stage 1: Install backend deps + build frontend
# Layer order is optimized for frontend-only changes (the most common case):
# both installs are at the top, the frontend build lives at the bottom.
# Backend TypeScript is copied as-is — bun runs it natively at runtime.
FROM oven/bun:1.3.11 AS build

WORKDIR /app

# Installs first — cached until a lockfile changes
COPY backend/package.json backend/bun.lock backend/
COPY frontend/package.json frontend/bun.lock frontend/
RUN cd backend && bun install --frozen-lockfile
RUN cd frontend && bun install --frozen-lockfile

# Backend source — copied after installs so only `src` changes invalidate this layer
COPY backend/src backend/src

# Frontend build — most likely to change, lives at the bottom of the chain
COPY frontend/tsconfig.json frontend/tsconfig.node.json frontend/
COPY frontend/vite.config.ts frontend/index.html frontend/
COPY frontend/src frontend/src
COPY frontend/public frontend/public
RUN cd frontend && bun run build

# Assemble dist
RUN mkdir /dist && \
    cp -r backend/src /dist/src && \
    cp -r backend/node_modules /dist/node_modules && \
    mkdir /dist/public && \
    cp -r frontend/build/* /dist/public/


# Stage 2: Runtime
FROM oven/bun:1.3.11-slim

EXPOSE 7000
VOLUME /templates

COPY --from=build /dist /home
WORKDIR /home
CMD ["bun", "./src/server.ts"]
