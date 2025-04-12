# ===============================================
# hugo build
# See https://docker.hugomods.com/docs/introduction/

# alpine based image
FROM hugomods/hugo:latest AS hugo

# install bun
RUN apk update && apk --no-cache add bash curl unzip  && \
  curl https://bun.sh/install | bash

ENV PATH="${PATH}:/root/.bun/bin"
ENV HUGO_CACHEDIR=/tmp/hugo_cache
ENV BUN_INSTALL_CACHE_DIR=/tmp/bun_cache

WORKDIR /src

# install dependencies
COPY package.json bun.lockb ./
RUN \
  --mount=type=cache,target=${BUN_INSTALL_CACHE_DIR} \
  bun install --frozen-lockfile

# copy rest of source
COPY . .

# run hugo passing secrets and cache mount
RUN \
  --mount=type=cache,target=${HUGO_CACHEDIR}/modules/ \
  --mount=type=secret,id=HUGO_IMGPROXY_KEY \
  --mount=type=secret,id=HUGO_IMGPROXY_SALT \
  HUGO_IMGPROXY_KEY="$(cat /run/secrets/HUGO_IMGPROXY_KEY)" \
  HUGO_IMGPROXY_SALT="$(cat /run/secrets/HUGO_IMGPROXY_SALT)" \
  hugo

# build pagefind index from hugo's output
RUN bun run pagefind --site public


# ===============================================
# final image

# debian slim based image
FROM oven/bun:slim AS final

ENV BUN_INSTALL_CACHE_DIR=/tmp/bun_cache

# install only production dependencies (not devDependencies)
COPY package.json bun.lockb ./

RUN \
  --mount=type=cache,target=${BUN_INSTALL_CACHE_DIR} \
  bun install --frozen-lockfile --production

# copy bun app
COPY backend ./backend

# set bun listening port
ENV PORT=8080

# copy hugo output
COPY --from=hugo /src/public ./public

ENTRYPOINT ["bun", "run", "backend/index.ts"]

EXPOSE 8080
