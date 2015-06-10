README for loopnav
------------------

this is a small express 4.x / EJS application to call some loop API's

* The main use is as a testbed for my own experiments, do not expect
anything production-ready. *

## Setup 

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

todo ...


## setup for Linux 

todo ...


