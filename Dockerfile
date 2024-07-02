# hugo build stage
FROM hugomods/hugo:latest AS hugo
COPY . /src

RUN \ 
    --mount=type=secret,id=HUGO_IMGPROXY_KEY \
    --mount=type=secret,id=HUGO_IMGPROXY_SALT \
    HUGO_IMGPROXY_KEY="$(cat /run/secrets/HUGO_IMGPROXY_KEY)" \
    HUGO_IMGPROXY_SALT="$(cat /run/secrets/HUGO_IMGPROXY_SALT)" \
    hugo --minify --enableGitInfo

# final caddy image
FROM caddy:2.8.4-alpine

# copy hugo output
COPY --from=hugo /src/public /usr/share/caddy

# copy caddy configuration
COPY Caddyfile /etc/caddy/Caddyfile