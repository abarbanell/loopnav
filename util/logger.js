var logger = function() {

    // this is very short but we do not want the application to know how we do logging. 
    // maybe we want to have a more complex logging later
    
  var winston = require('winston');
  return winston;
}();

module.exports = logger;