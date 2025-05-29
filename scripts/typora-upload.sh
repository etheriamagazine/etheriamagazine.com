#!/bin/bash

for source; do
  filename="$(basename "$source")"
  target="fly:fotos.etheriamagazine.com/$(date +%Y/%m)/$(basename "$source")"
  rclone copyto "$source" "$target"
  if [ $? -eq 0 ]
  then
    echo ${target/fly:/https://}
  else
    echo "Could not create file"
  fi
done
