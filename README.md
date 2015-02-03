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
```

all of these can be added as free addons in heroku.


Need to fix: 

- paging backwards
- detecting end of user list
- mongocheck: load only 1 per call
- reduce logging
- cache expiry
- user table - add retrieved data and expiry.
- add logger with configurable log level (but to stdout)
- create newrelic custom attributes
- dockerize environment for offline development
- refactor and cleanup
- tests

