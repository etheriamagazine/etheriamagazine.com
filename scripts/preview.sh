#!/bin/bash
# build hugo


HUGO_MODULE_WORKSPACE=hugo.work hugo
bun --watch run ./backend/index.ts
