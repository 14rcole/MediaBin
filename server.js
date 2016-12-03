// set up ======================================================================
var express  = require('express');
var app      = express(); 								// create our app w/ express
var mongoose = require('mongoose'); 					// mongoose for mongodb
var port  	 = process.env.PORT || 8080; 				// set the port
var database = require('./config/database'); 			// load the database config
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var multer = require('multer');

// configuration ===============================================================
mongoose.connect(database.url); 	// connect to mongoDB database on modulus.io

app.all('/', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-Within, Content-Type, Accept");
});

app.use(express.static(__dirname + '/public')); 		// set the static files location /public/img will be /img for users
app.use(bodyParser.urlencoded({'extended':'true'})); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride('X-HTTP-Method-Override')); // override with the X-HTTP-Method-Override header in the request

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req,file, cb) {
        cb(null, file.originalname);
    }
});

var upload = multer({ storage: storage });

// models =====================================================================
var user = require('./app/models/user');
var file = require('./app/models/file');

// routes ======================================================================
var userRoutes = require('./app/routes/user');
var fileRoutes = require('./app/routes/file');

// register routes ============================================================
app.post('/user/', userRoutes.createUser);
app.get('/user/:username', userRoutes.getUser);
app.put('/user/edit/:id', userRoutes.updateUser);
app.delete('/user/delete/:id', userRoutes.deleteUser);

app.post('/file/upload', upload.fields([{name: 'fingerprint', maxCount: 1 }, { name: 'mediaFile', maxCount: 1 }]), fileRoutes.postFile);
app.get('/file/fprintmatch', upload.single('fingerprint'), fileRoutes.matchFprint);
app.get('/file/get/:uid/:filename', fileRoutes.getFile);
app.get('/file/download/:uid/:fileid', fileRoutes.downloadFile);
app.delete('/file/delete/:uid/:fileid', fileRoutes.deleteFile);


// listen (start app with node server.js) ======================================
app.listen(port);
console.log("App listening on port " + port);
