// set up ======================================================================
var express  = require('express');
var app      = express(); 								// create our app w/ express
var mongoose = require('mongoose'); 					// mongoose for mongodb
var port  	 = process.env.PORT || 8080; 				// set the port
var database = require('./config/database'); 			// load the database config
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

// configuration ===============================================================
mongoose.connect(database.url); 	// connect to mongoDB database on modulus.io

app.use(express.static(__dirname + '/public')); 		// set the static files location /public/img will be /img for users
app.use(bodyParser.urlencoded({'extended':'true'})); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride('X-HTTP-Method-Override')); // override with the X-HTTP-Method-Override header in the request


// models =====================================================================
var user = require('./app/models/user');
var file = require('./app/models/file');

// routes ======================================================================
var userRoutes = require('./app/routes/user');
var fileRoutes = require('./app/routes/file');

// register routes ============================================================
app.post('/user/new', userRoutes.createUser);
app.get('/user/:username', userRoutes.getUser);
app.put('/user/:id/edit', userRoutes.updateUser);
app.delete('/home/:id', userRoutes.deleteUser);

app.post('/file/upload', fileRoutes.postFile);
app.get('/file/fprintmatch', fileRoutes.matchFprint);

// listen (start app with node server.js) ======================================
app.listen(port);
console.log("App listening on port " + port);
