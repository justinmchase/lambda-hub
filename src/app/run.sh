#!/bin/bash
function _term() {
  kill -TERM "$child" 2>/dev/null
}
trap _term SIGTERM SIGINT ERR
npx nodemon -q --watch /var/app --watch /var/tasks . &
child=$!
wait
