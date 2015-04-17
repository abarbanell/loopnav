README for loopnav
------------------

this is a small express 4.x / EJS application to call some loop API's

to setup the runtime environment you need to set these variables:

```
CLOUDAMQP_URL:         <your rabbit mq connection string>
MONGOLAB_URI:          <your mongodb connectionstring> 
NEW_RELIC_LICENSE_KEY: <your newrelic license>
NEW_RELIC_LOG:         stdout
NODE_MODULES_CACHE:    false
PAPERTRAIL_API_TOKEN:  <your papertrail API token>
LOOP_API_PREFIX        <optional prefix default http://loop.frontiersin.org/api/v1/users/>
LOG_LEVEL:             <error|info|debug - default error>
```

all of these can be added as free addons in heroku.

# Test environment

Development should be possible on a local workstation or on a cloud IDE like c9.io

## setup for MacOS

We will run MongoDB and RabbitMQ locally using Docker. 
Logging will be to stdout, no papertrail connected.

Setup: 

- get [boot2docker](https://github.com/boot2docker/osx-installer/releases/tag/v1.6.0) 
  and [docker.compose](https://docs.docker.com/compose/install/)
- get [devenv.sh](https://bitbucket.org/abarbanell/loopnav.devenv) and start environment


## setup for c9.io


## setup for Linux 




Need to fix: 

- mongocheck: load only 1 per call (done)
- add logger with configurable log level (logging to stdout) - (done)

- reduce logging (started)
- tests for util/*.js (in progress)

- paging backwards
- detecting end of user list
- cache expiry
- user table - add retrieved data and expiry.
- create newrelic custom attributes
- dockerize environment for offline development
- refactor and cleanup
- tests for model/*.js
- tests for routes/*.js
- tests for bin/www and /server.js
- add robots.txt

