var version = process.env.API_VERSION;

//module dependencies
var toobusy = require('toobusy')
    , express = require('express')
    , path = require('path')
    , passport = require('passport')
    , functions = require('./modules/functions')
    , ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn
    , app = module.exports = express();

//dont crash on overload
app.use(function(req, res, next) {
	if (toobusy()) {
		res.send(503, "We have too much traffic try again in a few seconds, sorry.");
	} else {
		next();
	}
});

//routes
var index = require('./routes/index')
	,users = require('./routes/api/users')
    ,bodyParser = require('body-parser');

//static and port
app.configure(function(){
    app.enable('trust proxy');
    app.set('port', process.env.PORT || 3000);
    app.set('view engine', 'ejs');
    if(process.env.PORT){
        app.set('views', __dirname + '/dist/views');
        app.use(express.static(path.join(__dirname, 'dist/public')));
    } else{
        app.set('views', __dirname + '/views');
        app.use(express.static(path.join(__dirname, 'public')));
    }
    app.use(express.cookieParser());
    app.use(bodyParser());
    if(process.env.PORT){
        app.use(express.logger('dev'));
        //app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
        // app.use(express.session({
        //     maxAge: 3600 * 1000 * 24 * 31 * 10,
        //     secret: 't2obo2!',
        //     cookie: {
        //         domain: '.voice.ee',
        //         maxAge: 3600 * 1000 * 24 * 31 * 10
        //     },
        	//store: new DynamoDBStore(DynamoDBoptions)
    }else{
        app.use(express.logger('dev'));
        app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
        app.use(express.session({
            secret: 'tobo!',
            maxAge: 36000009,
            cookie: { maxAge: 60 * 60 * 10008 }
            //store: new DynamoDBStore(DynamoDBoptions)
        }));
    }

    app.use(passport.initialize());
    app.use(passport.session());

    app.use(app.router);

    app.use(function(err, req, res, next){
        if(err.stack)
            console.log(err.stack);
        if(err && err.redirect)
            return res.redirect(err.redirect);
        else if(err == "503")
            return res.send('Token has expired. Please try again.');
        else if(err)
            return res.render('error', {error: err});
        else
            return res.send("An error occured. Please try again in a few seconds.");
    });
});

//error management

process.on('uncaughtException', function(err){
    console.log(err);
    process.exit(0);
});

var csrf = express.csrf();

// Passport configuration
require('./modules/auth');

//status
app.get('/status', index.status);
//paths for html
app.get('/', ensureLoggedIn('/login'), index.rte);
app.get('/rte', ensureLoggedIn('/login'), index.rte);
app.get('/login', index.login);
//logins
app.get('/auth/facebook', passport.authenticate('facebook'));
app.get('/auth/facebook/callback', passport.authenticate('facebook', { successReturnToOrRedirect: '/', failureRedirect: '/login' }));
//logout
app.get('/logout', index.logout);

//users
app.get('/'+version+'/users/:id',ensureLoggedIn('/login'), users.show);
//default
app.get('*', index.notfound);


