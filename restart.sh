#!/usr/bin/env bash

docker container rm -f 'water-and-land-dev'
docker build . -t 'water-and-land-dev'
docker container run -p "6642:5000" --mount "type=bind,source=/mnt/seenas2/data/NPS_converted,target=/data" --name 'water-and-land-dev' -td 'water-and-land-dev'
