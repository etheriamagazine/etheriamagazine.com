#!/bin/bash

# use go workspace to use local dependencies instead of github in dev
export HUGO_MODULE_WORKSPACE=hugo.work

# first hugo pass
# hugo

# pagefind index
# bunx pagefind

# start server
hugo server --cleanDestinationDir # --templateMetrics --templateMetricsHints --printUnusedTemplates &



# build hugo
# HUGO_MODULE_WORKSPACE=hugo.work hugo server  --cleanDestinationDir
