
/**
 * Module dependencies.
 */

var express = require('express'),
	http = require('http'), 
	path = require('path'),
	config = require('./config')(),
	app = express(),
	Datastore = require('nedb'),
	calendarUrl = 'nedb/calendar.db',
	contentUrl = 'nedb/content.db',
	menuUrl = 'nedb/menu.db',
	defaultMenu = require('./utils/utils').returnJsonFromFile('/../config/default_menu.json');

function createVariables(variables) {
    for (var varName in variables) {
    	//console.log(variables)
        varName = variables[varName.split('.')[0]];
    }
}

// below we'll dynamically load the controllers
Object.prototype.extend = function(x) {
   for(i in x)
      this[i] = x[i];
};
require('fs').readdirSync('./controllers').forEach(function (file) {
  // If its the current file ignore it 
  if (file === 'index.js') return;
  // Prepare empty object to store module 
  var mod = {};
  // Store module with its name (from filename)
  mod[path.basename(file, '.js')] = require("./controllers/" + file);
  // Extend module.exports
  module.exports.extend(mod);
});

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
nedb.content = new Datastore({ filename: contentUrl, autoload: true });
nedb.menu = new Datastore({ filename: menuUrl, autoload: true });
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

var pages = ['about-us','gallery','contact'];


var attachDB = function(req, res, next) {
	req.contentdb = nedb.content;
	req.menudb = nedb.menu;
	req.menudb.ensureIndex({ fieldName: 'menuitem', unique: true }, function (err) {});
	next();
};
app.all('/admin*', attachDB, function(req, res, next) {
	module.exports.Admin.run(req, res, next);
});			
app.all('/blog/:id', attachDB, function(req, res, next) {
	module.exports.Blog.runArticle(req, res, next);
});	
app.all('/blog', attachDB, function(req, res, next) {
	module.exports.Blog.run(req, res, next);
});	
app.all('/home', attachDB, function(req, res, next) {
	res.redirect('/');
});		
app.all('/', attachDB, function(req, res, next) {
	module.exports.Home.run(req, res, next);
});
// here we grab the admin generated pages and create a route for them
nedb.menu.find({}, function (err, menuitems){ 
	for(var i=0; record = menuitems[i]; i++) {
		var menuitem = record.menuitem;
		app.all('/' + menuitem, attachDB, function(req, res, next) {
			module.exports.Page.run(menuitem, req, res, next);
		});	
	}
	http.createServer(app).listen(config.port, function() {
	  	console.log(
	  		'\nExpress server listening on port ' + config.port
	  	);
	});
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