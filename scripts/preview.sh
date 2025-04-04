#!/bin/bash
# build hugo

export HUGO_MODULE_WORKSPACE=hugo.work

# first hugo pass
hugo

# pagefind index
# bunx pagefind

# run honojs app
bun --watch run ./backend/index.ts
