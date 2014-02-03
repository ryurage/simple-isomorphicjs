
/**
 * Module dependencies.
 */

var express = require('express'),
	http = require('http'), 
	path = require('path'),
	config = require('./config')(),
	app = express(),
	MongoClient = require('mongodb').MongoClient,
	Admin = require('./controllers/Admin'),
	Home = require('./controllers/Home'),
	Blog = require('./controllers/Blog'),
	Page = require('./controllers/Page'),
	Datastore = require('nedb'),
	calendarUrl = 'nedb/calendar.db';

// all environments
// app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/templates');
app.set('view engine', 'hjs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('fast-delivery-site'));
app.use(express.session());
app.use(app.router);
app.use(require('less-middleware')({ src: __dirname + '/public' }));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  	app.use(express.errorHandler());
}

nedb = {};
nedb.calendar = new Datastore({ filename: calendarUrl, autoload: true });
//nedb.calendar.remove({});

app.post('/save', function(req, res){
  var jsonData = req.body;
  console.log(jsonData);
  res.contentType('json');
  res.json({ some: JSON.stringify({response:'json'}) });
  nedb.calendar.insert({
  	day: jsonData.day,
  	month: jsonData.month,
  	year: jsonData.year,
  	link: jsonData.link,
  	descript: jsonData.descript,
  	what: jsonData.what,
  	start_time: jsonData.start_time,
  	end_time: jsonData.end_time,
  	start_date: jsonData.start_date,
  	end_date: jsonData.end_date,
  	location: jsonData.location,
  	repeat_interval: jsonData.repeat_interval,
  	}, function(err, saved) {
	  if( err || !saved ) res.end( "Event not saved"); 
	  else res.end( "Event saved");
  });
});


MongoClient.connect('mongodb://' + config.mongo.host + ':' + config.mongo.port + '/fastdelivery', function(err, db) {
	if(err) {
		console.log('Sorry, there is no mongo db server running.');
	} else {
		var attachDB = function(req, res, next) {
			req.db = db;
			next();
		};
		app.all('/admin*', attachDB, function(req, res, next) {
			Admin.run(req, res, next);
		});			
		app.all('/blog/:id', attachDB, function(req, res, next) {
			Blog.runArticle(req, res, next);
		});	
		app.all('/blog', attachDB, function(req, res, next) {
			db.collection('fastdelivery', function(err, collection) {
				collection.find().toArray(function(err, docs) {
				    console.log('docs: ',docs);
				});
			});

			Blog.run(req, res, next);
		});	
		app.all('/services', attachDB, function(req, res, next) {
			Page.run('services', req, res, next);
		});	
		app.all('/careers', attachDB, function(req, res, next) {
			Page.run('careers', req, res, next);
		});	
		app.all('/contacts', attachDB, function(req, res, next) {
			Page.run('contacts', req, res, next);
		});	
		app.all('/', attachDB, function(req, res, next) {
			Home.run(req, res, next);
		});		
		http.createServer(app).listen(config.port, function() {
		  	console.log(
		  		'Successfully connected to mongodb://' + config.mongo.host + ':' + config.mongo.port,
		  		'\nExpress server listening on port ' + config.port
		  	);
		});
	}
});

app.use(function(req, res, next){
  res.status(404);

  // respond with html page
  if (req.accepts('html')) {
    res.send(404, 'Sorry cant find that!');
    return;
  }

  // respond with json
  if (req.accepts('json')) {
    res.send({ error: 'Not found' });
    return;
  }

  // default to plain-text. send()
  res.type('txt').send('Not found');
});