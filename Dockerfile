# ==============================================================================
# hugo site build
# See https://docker.hugomods.com/docs/introduction/

FROM hugomods/hugo:latest AS hugo

COPY . /src

# install dev dependencies
RUN npm install

# run hugo passing secrets
RUN \
    --mount=type=secret,id=HUGO_IMGPROXY_KEY \
    --mount=type=secret,id=HUGO_IMGPROXY_SALT \
    HUGO_IMGPROXY_KEY="$(cat /run/secrets/HUGO_IMGPROXY_KEY)" \
    HUGO_IMGPROXY_SALT="$(cat /run/secrets/HUGO_IMGPROXY_SALT)" \
    hugo --minify --enableGitInfo --ignoreCache

# ==============================================================================
# final image
FROM oven/bun:latest

# copy bun app
COPY package.json ./
COPY bun.lockb ./
COPY backend ./backend

RUN bun install

# set
ENV PORT=8080

# copy hugo output
COPY --from=hugo /src/public ./public

ENTRYPOINT ["bun", "run", "backend/index.ts"]

EXPOSE 8080
