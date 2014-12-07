
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , http = require('http')
  , path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.locals({
    title: 'Beluga'    // default title
});

// Routes

app.get('/', routes.site.index);
app.post('/', routes.site.searchcluster);

app.get('/websites', routes.websites.list);
app.post('/websites', routes.websites.create);
app.get('/websites/:id', routes.websites.show);
app.post('/websites/:id', routes.websites.edit);
app.del('/websites/:id', routes.websites.del);

app.post('/websites/:id/follow', routes.websites.follow);
app.post('/websites/:id/unfollow', routes.websites.unfollow);

app.post('/websites/:id/createandfollow', routes.websites.createandfollow);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening at: http://localhost:%d/', app.get('port'));
});
