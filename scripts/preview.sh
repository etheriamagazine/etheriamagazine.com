#!/bin/bash

# use local dev workspace
export HUGO_MODULE_WORKSPACE=hugo.work

# build hugo
hugo

# build pagefind index
bun run pagefind --site public

# run honojs app
bun --watch run ./backend/index.ts
