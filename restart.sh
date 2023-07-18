#!/usr/bin/env bash

docker container rm -f 'water-and-land'
docker build . -t 'water-and-land'
docker container run -p "6643:5000" --mount "type=bind,source=/mnt/seenas2/data/NPS_converted,target=/data" --name 'water-and-land' -td 'water-and-land'
