#!/bin/bash

# build hugo
HUGO_MODULE_WORKSPACE=hugo.work hugo server  --cleanDestinationDir --ignoreCache   --templateMetrics --templateMetricsHints --printUnusedTemplates
