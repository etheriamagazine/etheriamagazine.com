# hugo build stage
FROM hugomods/hugo:latest AS hugo
COPY . /src

RUN hugo --minify --enableGitInfo

# final caddy image
FROM caddy:2.8.4-alpine

# copy hugo output
COPY --from=hugo /src/public /usr/share/caddy

# copy caddy configuration
COPY Caddyfile /etc/caddy/Caddyfile