# =============================================================================
# Build Hugo https://docker.hugomods.com/docs/introduction/

# Alpine based image
FROM hugomods/hugo:latest AS hugo

# Install bun
RUN apk update && apk --no-cache add bash curl unzip  && \
  curl https://bun.sh/install | bash

ENV PATH="${PATH}:/root/.bun/bin"
ENV HUGO_CACHEDIR=/tmp/hugo_cache
ENV BUN_INSTALL_CACHE_DIR=/tmp/bun_cache

WORKDIR /src

# Install dependencies
COPY package.json bun.lockb ./
RUN \
  --mount=type=cache,target=${BUN_INSTALL_CACHE_DIR} \
  bun install --frozen-lockfile

# Copy rest of source
COPY . .

# Run hugo passing secrets and cache mount
RUN \
  --mount=type=cache,target=${HUGO_CACHEDIR}/modules/ \
  --mount=type=secret,id=HUGO_IMGPROXY_KEY \
  --mount=type=secret,id=HUGO_IMGPROXY_SALT \
  HUGO_IMGPROXY_KEY="$(cat /run/secrets/HUGO_IMGPROXY_KEY)" \
  HUGO_IMGPROXY_SALT="$(cat /run/secrets/HUGO_IMGPROXY_SALT)" \
  hugo

# Build pagefind index from hugo's output
RUN bun run pagefind --site public


# =============================================================================
# Final image

# Debian based image
FROM oven/bun:slim AS final

ENV BUN_INSTALL_CACHE_DIR=/tmp/bun_cache

# Install only production dependencies (not devDependencies)
COPY package.json bun.lock ./

RUN \
  --mount=type=cache,target=${BUN_INSTALL_CACHE_DIR} \
  bun install --frozen-lockfile --production

# Copy bun app
COPY backend ./backend

# Set bun listening port
ENV PORT=8080

# Copy Hugo output
COPY --from=hugo /src/public ./public

ENTRYPOINT ["bun", "run", "backend/index.ts"]

EXPOSE 8080
