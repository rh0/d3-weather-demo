/**
 * Module dependencies.
 */

require('newrelic');
var express = require('express');
var http = require('http');
var routes = require('./routes');
var user = require('./routes/user');
var weather = require('./routes/weather');
var path = require('path');
var cronJob = require('cron').CronJob;
var time = require('time');
var db = require('./model/db');
var noaa = require('./util/noaa');

// Initializing a cron task to ultimately check noaa data
// and write it to mongo.
new cronJob('0 0 * * * *', function() {
  console.log('jsCron firing every hour.');
  noaa.fetchNoaaData();
}, null, true, "America/Chicago");


var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

// middleware
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

//routes
app.get('/', routes.index);
app.get('/users', user.list);
app.get('/weather-data', weather.fetchWeather);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
