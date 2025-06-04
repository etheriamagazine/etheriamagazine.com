#!/bin/bash

source .env.local


hugo server

# docker run --rm \
#   --name mysite2 \
#   --env-file ${PWD}/.env.local \
#   -v ${PWD}:/src \
#   -p 1313:1313 \
#   hugomods/hugo:latest \
#   hugo server
