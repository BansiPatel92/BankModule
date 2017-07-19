//plugins

var express = require('express'),
    morgan = require('morgan'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    fs = require('fs'),
    path = require('path'),
    http = require('http'),
    https = require('https'),
    session = require('express-session'),
    parseurl = require('parseurl'),
    compression = require('compression'),
    users = require('./routes/users'),
    authenticate = require('./routes/authenticate');

//routes
var sms = require('./routes/sms'),
    banks = require('./routes/banks'),
    applications = require('./routes/applications');
    // users = require('./routes/users');
var app = express(); // create our app w/ express
// app.use(morgan('dev'));


app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true
}));

app.use(compression());

// app.get('/', function(req, res) {
//   // res.sendFile(__dirname + "/app/index.html");
// });

app.use(express.static(path.join(__dirname, '/app')));
app.use('/documents', express.static(path.join(__dirname, '/Uploads')));

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ 'extended': 'true' }));
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));
app.use(methodOverride());

app.set('views', path.join(__dirname, '/app'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');


app.use('/api/sms', sms);
app.use('/api/banks', banks);
app.use('/api/applications', applications);
app.use('/api/users', users);
app.use('/api/auth', authenticate);
// app.use('/api/users', users);
process.on('uncaughtException', function (error) {
    console.log("Error Occured");
    console.log(error.stack);
});

app.get('/*', function (req, res) {
    var data = null;
    data = Object.assign({}, req.app.tuser);
    req.app.tuser = null;
    res.render('index', { val: data });
});

http.createServer(app).listen(3005,'0.0.0.0');
console.log("app is Listening on port 3005");