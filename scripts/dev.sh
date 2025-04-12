#!/bin/bash

# use local dev workspace
export HUGO_MODULE_WORKSPACE=hugo.work

# run hugo dev server
hugo server

# try some debugging flags too!
# hugo server --cleanDestinationDir --templateMetrics --templateMetricsHints --printUnusedTemplates
