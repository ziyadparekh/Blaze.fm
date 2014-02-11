
//module dependencies
var express = require('express'),
mysql      = require('mysql'),
path = require('path');
var app = express();

//routes
var index = require('./routes/index'),
tracks = require('./routes/api/tracks')

app.configure(function(){
	app.set('port', process.env.PORT || 3010);
	app.set('views', __dirname + '/views');
	app.set('view engine', 'ejs');
})

//global config
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.cookieParser());
app.use(express.bodyParser());

app.get('/', index.index);

app.post('/tracks', tracks.create);
app.get('/tracks', tracks.list);

// app.get('/topics/:id', topic.get);
// app.put('/topics/:id', topic.edit);
// app.delete('/topics/:id', topic.remove);

app.listen(process.env.PORT || 3010 || 4000);