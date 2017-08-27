# docker.sock-socket

Realtime docker.sock container stats powered by socket.io.

## For development environments

This dashboard exposes a lot of information about your containers. At this time it is not recommended for production environments.

## Run

Example of running in daemon mode:

    docker run -d --rm \
    -v /var/lib/docker/:/var/lib/docker:ro \
    -v /var/run/docker.sock:/var/run/docker.sock:ro \
    -v $(pwd)/src:/opt/src \
    -p 3000:3000 \
    --name docker.sock-socket dahyphenn/docker.sock-socket:latest

## Build

An example of building, change the tag as needed:

    docker build -t dahyphenn/docker.sock-socket:latest .