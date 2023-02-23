#!/bin/bash

for folder in ./*; do
  if [ -f "$folder/docker-compose.yml" ]; then
    cd "$folder"
    docker-compose up -d
    cd - || exit
  fi
done
