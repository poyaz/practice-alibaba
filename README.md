Introduction
============

This project is a practice for the "alibaba" company interview. This sample project has sharpener URL with authenticate.

Requirement
===========

* docker
* nodejs

How to deploy
=============

## Use docker

This service has configured as default and no need be change any config. IF you use docker follow below command:

```bash
# Default port is 3000
docker-compsoe up -d

# If you want run in another port use this
HTTP_PORT=8080 docker-compsoe up -d
```

## without docker

If you don't use docker you have to do below step:

1. You should install nodejs version 14 or above
2. You should install mysql
3. copy `env/node/.env.example` to`env/node/.env`
4. open file **env/app/.env**
5. change environment variable if need
7. execute this command: `npm install --only prod; npm start`
