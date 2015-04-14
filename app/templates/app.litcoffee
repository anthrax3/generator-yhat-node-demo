These are our dependencies. There are many like them, but these are ours.

    express = require('express')
    logger = require('morgan')
    compress = require('compression')
    methodOverride = require('method-override')
    favicon = require('serve-favicon')
    hbs = require('express-hbs')
    path = require('path')
    fs = require('fs')
    http = require('http')
    yhat = require('yhat')

Initialize the Yhat client from environment variables. These can be set by 
running `export YHAT_USERNAME=*your username*` or in heroku by running
`heroku config:set YHAT_USERNAME=*your username*`

    yh = yhat.init(process.env.YHAT_USERNAME, process.env.YHAT_APIKEY, 'http://cloud.yhathq.com/')

This app uses express, so we need to create an express app and then setup 
the middleware.

    app = express()

    app.set 'port', process.env.PORT or <%= port %>

We're using [handlebars](http://handlebarsjs.com/).

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

This is the page that the user sees. Params is an array of example data
that we can display for the user so they can make predictions without
having to think about what data to plug into the form.

    app.get '/', (req, res) ->
      res.render 'index', params: []

This is the endpoint that handles making predictions and interacting with
ScienceOps. It's just a really simple POST request that uses the [yhat-node](https://github.com/yhat/yhat-node)
client.

    app.post '/', (req, res) ->
      data = req.body
      yh.predict '<%= modelname %>', data, (err, result) ->
        res.send result

Bots!!!

    app.get '/robots.txt', (req, res) ->
      fs.readFile __dirname + '/robots.txt', (err, data) ->
        res.header 'Content-Type', 'text/plain'
        res.send data

Any other URL gets a 404.

    app.get '*', (req, res) ->
      res.render '404'

    http.createServer(app).listen app.get('port'), ->
      console.log 'Express server listening on port ' + app.get('port')
