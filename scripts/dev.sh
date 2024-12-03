#!/bin/bash

# use go workspace to use local dependencies instead of github in dev
export HUGO_MODULE_WORKSPACE=hugo.work

# first hugo pass
hugo

# create pagefind index
bunx pagefind --site public

# start server
hugo server --logLevel info --cleanDestinationDir # --templateMetrics --templateMetricsHints --printUnusedTemplates

# build hugo
# HUGO_MODULE_WORKSPACE=hugo.work hugo server  --cleanDestinationDir
