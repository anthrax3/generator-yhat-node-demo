var express = require('express'),
    logger = require('morgan'),
    compress = require('compression'),
    methodOverride = require('method-override'),
    favicon = require('serve-favicon'),
    hbs = require('express-hbs'),
    path = require('path'),
    fs = require('fs'),
    http = require('http'),
    yhat = require('yhat');


var yh = yhat.init(
  process.env.YHAT_USERNAME,
  process.env.YHAT_APIKEY,
  "http://cloud.yhathq.com/"
);

var app = express();


app.set('port', process.env.PORT || <%= port %>);

app.set('views', __dirname + '/views');

app.engine('html', hbs.express4({
  partialsDir: path.join(__dirname, 'views', 'partials'),
  defaultLayout: path.join(__dirname, 'views', 'layout.html')
}));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');
app.enable('view cache');

app.use(compress())
   .use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
   .use(logger('dev'))
   .use(methodOverride())
   .use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res) {
  res.render('index', { params: [] });
});

app.post('/', function(req, res) {
  data = req.body;
  yh.predict("<%= modelname %>", data, function(err, result) {
    res.send(result);
  });
});

app.get('/robots.txt', function(req, res) {
  fs.readFile(__dirname + "/robots.txt", function(err, data) {
    res.header('Content-Type', 'text/plain');
    res.send(data);
  });
});

app.get('*', function(req, res) {
  res.render('404');
});

http.createServer(app).listen(app.get('port'), function() {
  console.log("Express server listening on port " + app.get('port'));
});
