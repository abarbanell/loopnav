var users = require('../model/users');
var db = require('../util/db');
db.bind('user');

var start = 0;
var iterations = 210000;
var timeout = 50;

var pics = 0;
var nopics = 0;
var notfound = 0;
var missing = 0;

if (!('contains' in String.prototype)) {
  String.prototype.contains = function(str, startIndex) {
    return ''.indexOf.call(this, str, startIndex) !== -1;
  };
}



function check(id) {
  db.user.findOne({userId: id}, function(err,res) {
    if (err) {
      console.log('id: ' + id + ', err: ' + err );
    } else {
      if (res)  {
        if (res.status === 'ok-with-pic') pics++;
        if (res.status === 'no-pic') nopics++;
        if (res.status === 'not-found') notfound++;
        console.log('id: ' + id + ' - ' + res.status + ',\t' + pics 
          + 'p/' + nopics + 'np/' + notfound + 'nf/' + missing + 'm.');
      } else {
        missing++;
        console.log('id: ' + id + ' - **** MISSING **** - ' + missing);
        fill(id);
      }
    }
  });
  return iterate();
}

function fill(id) {
  users.load(id, 1, function(err, res) {
    if (!err) console.log('id: ' + id + ' - #### FILLED  #### ');
  }); 
}



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

// remove some data to make sure we have something to fill
db.user.remove({ userId: 3 }, function(err, res){
  console.log('>>> user removed for testing');
});
iterate();


