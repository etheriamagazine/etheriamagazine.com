# ==============================================================================
# hugo site build
# See https://docker.hugomods.com/docs/introduction/

FROM hugomods/hugo:go AS hugo

ARG BUN_VERSION=1.0.15

# Install Bun in the specified version
RUN apt update && apt install -y bash curl unzip && \
 curl https://bun.sh/install | bash -s -- bun-v${BUN_VERSION}

ENV PATH="${PATH}:/root/.bun/bin"

# copy source
COPY . /src

RUN bun install --frozen-lockfile


# run hugo passing secrets
RUN \
    --mount=type=secret,id=HUGO_IMGPROXY_KEY \
    --mount=type=secret,id=HUGO_IMGPROXY_SALT \
    HUGO_IMGPROXY_KEY="$(cat /run/secrets/HUGO_IMGPROXY_KEY)" \
    HUGO_IMGPROXY_SALT="$(cat /run/secrets/HUGO_IMGPROXY_SALT)" \
    hugo --minify --enableGitInfo

# create index
RUN bun run pagefind

RUN \
    --mount=type=secret,id=HUGO_IMGPROXY_KEY \
    --mount=type=secret,id=HUGO_IMGPROXY_SALT \
    HUGO_IMGPROXY_KEY="$(cat /run/secrets/HUGO_IMGPROXY_KEY)" \
    HUGO_IMGPROXY_SALT="$(cat /run/secrets/HUGO_IMGPROXY_SALT)" \
    hugo --minify --enableGitInfo

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
