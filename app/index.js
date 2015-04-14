'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');
var mkdirp = require('mkdirp').sync;

module.exports = yeoman.generators.Base.extend({
  initializing: function () {
    this.pkg = require('../package.json');
  },

  prompting: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the delightful ' + chalk.red('YhatNodeDemo') + ' generator!'
    ));

    var prompts = [
      { name: "appname", message: "App name?"},
      { name: "description", message: "Description?", default: "This is my app. There are many like it, but this one is mine." },
      { name: "modelname", message: "Yhat model name?" },
      { name: "author", message: "Author name?", default: "Yhat" },
      { name: "author_uri", message: "Author website?", default: "https://yhathq.com/" },
      { name: "port", message: "Port?", default: "5000" },
      { name: "is_js", message: "JS or Coffee?", default: "js" }
    ];

    this.prompt(prompts, function (props) {
      this.props = props;
      this.appname = props.appname;
      this.description = props.description;
      this.modelname = props.modelname;
      this.author = props.author;
      this.author_uri = props.author_uri;
      this.port = props.port;
      this.is_js = props.is_js!="coffee";
      // To access props later use this.props.someOption;
      done();
    }.bind(this));
  },

  writing: {
    app: function () {
      mkdirp('views');
      mkdirp('views/partials');
      mkdirp('public/css');
      mkdirp('public/js');
      mkdirp('public/js/lib');
      mkdirp('public/img');
      mkdirp('public/fonts');
      this.template('_package.json', 'package.json');
      this.template('README.md', 'README.md');
      if (this.is_js) {
        this.template('app.js', 'app.js');
      } else {
        this.template('app.coffee', 'app.coffee');
      }
      this.template('views/layout.html', 'views/layout.html');
      this.template('views/index.html', 'views/index.html');
      this.copy('public/css/bootstrap.min.css', 'public/css/bootstrap.min.css');
      this.copy('public/favicon.ico', 'public/favicon.ico');
      this.copy('public/fonts/glyphicons-halflings-regular.eot', 'public/fonts/glyphicons-halflings-regular.eot');
      this.copy('public/fonts/glyphicons-halflings-regular.svg', 'public/fonts/glyphicons-halflings-regular.svg');
      this.copy('public/fonts/glyphicons-halflings-regular.ttf', 'public/fonts/glyphicons-halflings-regular.ttf');
      this.copy('public/fonts/glyphicons-halflings-regular.woff', 'public/fonts/glyphicons-halflings-regular.woff');
      this.copy('public/fonts/glyphicons-halflings-regular.woff2', 'public/fonts/glyphicons-halflings-regular.woff2');
      this.copy('public/js/lib/bootstrap.min.js', 'public/js/lib/bootstrap.min.js');
      this.copy('public/js/lib/jquery.min.js', 'public/js/lib/jquery.min.js');
      this.copy('public/js/lib/jquery.min.map', 'public/js/lib/jquery.min.map');
      this.copy('public/robots.txt', 'public/robots.txt');
    },

    projectfiles: function () {
      this.fs.copy(
        this.templatePath('editorconfig'),
        this.destinationPath('.editorconfig')
      );
      this.fs.copy(
        this.templatePath('jshintrc'),
        this.destinationPath('.jshintrc')
      );
    }
  },

  install: function () {
    this.installDependencies();
  }
});
