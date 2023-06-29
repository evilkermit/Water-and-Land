#!/usr/bin/env bash

if [ $# -lt 2 ]; then
	echo "usage: bash restart.sh PORT DATA_DIRECTORY" 1>&2
	exit 2
fi

docker container rm -f 'water-and-land'
docker build . -t 'water-and-land'
docker container run -p "$1:5000" --mount "type=bind,source=$2,target=/data" --name 'water-and-land' -td 'water-and-land'
