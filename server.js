//...........Load modules used in the app.......
var express = require('express');//get the express framework
var app = express();// app becomes an instance of an express server
var morgan = require('morgan');//morgan is the express middleware logger
var bodyParser = require('body-parser');// for parsing json requset

//..............Load Config Vars.................
var port = process.env.PORT || 8080;


//...........Load in middleware................
app.use(morgan('dev')); // log all request and errors 
app.use(bodyParser.json()); //pareses json reuest
app.use(express.static('public'));//serve static files


//............Set up Routes............
app.get('/health', function(req, res) {
  res.json({greeting: 'Howdy World!'});
 });

app.get('/greeting', function(req, res) {
 res.json({greeting: 'Howdy World!'});
});

app.post('/greeting', function(req, res) {
  var name = req.body.name;
  res.json({greeting: 'Howdy ' + name + '!' });
});


//.............Start the server............
app.listen(port, function(err) {
  if(err) {
    console.log('Unable to start server:');
    console.log(err);
  }
  else {
    console.log('Server listining on port ', port);
  }
});



