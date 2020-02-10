#!/bin/sh

docker run -p 5432:5432 -d --name=db delve_db
