#!/bin/bash

# build hugo debug
HUGO_MODULE_WORKSPACE=hugo.work hugo server  --cleanDestinationDir --ignoreCache --logLevel info # --templateMetrics --templateMetricsHints --printUnusedTemplates

# build hugo
# HUGO_MODULE_WORKSPACE=hugo.work hugo server  --cleanDestinationDir
