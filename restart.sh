#!/usr/bin/env bash
# usage: bash restart.sh PORT DATA_DIRECTORY

docker container rm -f 'water-and-land'
docker build . -t 'water-and-land'
docker container run -p "$1:5000" --mount "type=bind,source=$2,target=/data" --name 'water-and-land' -td 'water-and-land'
