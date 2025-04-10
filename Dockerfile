# ==============================================================================
# hugo site build
# See https://docker.hugomods.com/docs/introduction/

# Alpine Linux based image
FROM hugomods/hugo:latest AS hugo

# install bun
# RUN apk update && apk --no-cache add bash curl unzip  && \
# curl https://bun.sh/install | bash

# ENV PATH="${PATH}:/root/.bun/bin"

# copy source
COPY . /src

# install deps
# RUN bun install --frozen-lockfile
RUN npm install

# run hugo passing secrets
RUN \
    --mount=type=secret,id=HUGO_IMGPROXY_KEY \
    --mount=type=secret,id=HUGO_IMGPROXY_SALT \
    HUGO_IMGPROXY_KEY="$(cat /run/secrets/HUGO_IMGPROXY_KEY)" \
    HUGO_IMGPROXY_SALT="$(cat /run/secrets/HUGO_IMGPROXY_SALT)" \
    hugo --minify --enableGitInfo

# build pagefind index
RUN npx pagefind

# rerun hugo to include built index
# RUN \
#     --mount=type=secret,id=HUGO_IMGPROXY_KEY \
#     --mount=type=secret,id=HUGO_IMGPROXY_SALT \
#     HUGO_IMGPROXY_KEY="$(cat /run/secrets/HUGO_IMGPROXY_KEY)" \
#     HUGO_IMGPROXY_SALT="$(cat /run/secrets/HUGO_IMGPROXY_SALT)" \
#     hugo --minify --enableGitInfo

# ==============================================================================
# final image

FROM oven/bun:latest

# copy bun app
COPY package.json bun.lockb ./
COPY backend ./backend

# install only dependencies (not devDependencies)
RUN bun install --production

# set
ENV PORT=8080

# copy hugo output
COPY --from=hugo /src/public ./public

ENTRYPOINT ["bun", "run", "backend/index.ts"]

EXPOSE 8080
