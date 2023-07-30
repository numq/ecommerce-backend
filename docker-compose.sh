#!/bin/bash

for folder in ./*; do
  if [ -f "$folder/docker-compose.yml" ]; then
    cd "$folder" || exit
    docker-compose up -d
    cd - || exit
  fi
done
