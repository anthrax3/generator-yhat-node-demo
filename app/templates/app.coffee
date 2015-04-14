express = require('express')
logger = require('morgan')
compress = require('compression')
methodOverride = require('method-override')
fstaticavicon = require('serve-favicon')
hbs = require('express-hbs')
path = require('path')
fs = require('fs')
http = require('http')
yhat = require('yhat')

yh = yhat.init(process.env.YHAT_USERNAME, process.env.YHAT_APIKEY, 'http://cloud.yhathq.com/')

app = express()

app.set 'port', process.env.PORT or <%= port %>

# setup handlebars
app.set 'views', __dirname + '/views'
app.engine 'html', hbs.express4({
  partialsDir: path.join(__dirname, 'views', 'partials')
  defaultLayout: path.join(__dirname, 'views', 'layout.html')
})

app.set 'views', path.join(__dirname, 'views')
app.set 'view engine', 'html'
app.enable 'view cache'

app.use compress()
   .use favicon(path.join(__dirname, 'public', 'favicon.ico'))
   .use logger('dev')
   .use methodOverride()
   .use express.static(path.join(__dirname, 'public'))

app.get '/', (req, res) ->
  res.render 'index', params: []

app.post '/', (req, res) ->
  data = req.body
  yh.predict '<%= modelname %>', data, (err, result) ->
    res.send result

app.get '/robots.txt', (req, res) ->
  fs.readFile __dirname + '/robots.txt', (err, data) ->
    res.header 'Content-Type', 'text/plain'
    res.send data

app.get '*', (req, res) ->
  res.render '404'

http.createServer(app).listen app.get('port'), ->
  console.log 'Express server listening on port ' + app.get('port')
