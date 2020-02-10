#!/bin/sh

docker run -q -p 5432:5432 -d --name=db delve_db 2>/dev/null \
  || docker start db
