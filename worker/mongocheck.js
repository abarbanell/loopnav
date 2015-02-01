
var db = require('../util/db');
db.bind('user');

var pics = 0;
var nopics = 0;
var notfound = 0;
var missing = 0;

function check(id) {
  db.user.findOne({userId: id}, function(err,res) {
    if (err) {
      console.log('id: ' + id + ', err: ' + err );
    } else {
      if (res)  {
        if (res.status === 'ok-with-pic') pics++;
        if (res.status === 'no-pic') nopics++;
        if (res.status === 'not-found') notfound++;
        console.log('id: ' + id + ' - ' + res.status + ', ' + pics 
          + 'p/' + nopics + 'np/' + notfound + 'nf/' + missing + 'm.');
      } else {
        missing++;
        console.log('id: ' + id + ' - **** MISSING **** - ' + missing);
      }
    }
  });
  return iterate();
}

var start = 0;
var iterations = 210000;
var timeout = 50;


var iterate = function() {
  setTimeout(function() {
    iterations--;
    if (iterations > 0) {
      //console.log('todo: ' + iterations);
      check(++start);
    } else {
      console.log('done');
      setTimeout(process.exit, 2000);
    }
  }, timeout);
};

iterate();


