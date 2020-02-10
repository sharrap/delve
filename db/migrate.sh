#!/bin/sh

cd migrations && flyway migrate -configFiles=conf/flyway.conf -locations="filesystem:`pwd`/sql"
