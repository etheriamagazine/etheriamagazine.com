# ==============================================================================
# hugo site build
# See https://docker.hugomods.com/docs/introduction/

# Alpine Linux based image
FROM hugomods/hugo:latest AS hugo

# install bun
RUN apk update && apk --no-cache add bash curl unzip  && \
  curl https://bun.sh/install | bash

ENV PATH="${PATH}:/root/.bun/bin"

WORKDIR ./src
COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile

# install dependencies
COPY . .

# copy rest of source source

# run hugo passing secrets
RUN \
    --mount=type=secret,id=HUGO_IMGPROXY_KEY \
    --mount=type=secret,id=HUGO_IMGPROXY_SALT \
    HUGO_IMGPROXY_KEY="$(cat /run/secrets/HUGO_IMGPROXY_KEY)" \
    HUGO_IMGPROXY_SALT="$(cat /run/secrets/HUGO_IMGPROXY_SALT)" \
    hugo

# build pagefind index
RUN bun run pagefind


# ==============================================================================
# final image

FROM oven/bun:latest

# install only production dependencies (not devDependencies)
COPY package.json bun.lockb ./
RUN bun install --production

# copy bun app
COPY backend ./backend

# set
ENV PORT=8080

# copy hugo output
COPY --from=hugo /src/public ./public

ENTRYPOINT ["bun", "run", "backend/index.ts"]

EXPOSE 8080
