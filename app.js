require('dotenv').config();

const bodyParser      = require('body-parser');
const cookieParser    = require('cookie-parser');
const express         = require('express');
const favicon         = require('serve-favicon');
const mongoose        = require('mongoose');
const logger          = require('morgan');
const path            = require('path');
const User            = require('./models/user');
const bcrypt          = require('bcrypt');
const session         = require('express-session');
const passport        = require('passport')
const LocalStrategy   = require('passport-local').Strategy;
const MongoStore      = require('connect-mongo')(session);
const flash           = require('connect-flash');
const multer          = require('multer');
const cors            = require('cors');

require("./config/passport")

mongoose
  .connect('mongodb://localhost/newsprojectbackend', {useNewUrlParser: true})
  .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  })
  .catch(err => {
    console.error('Error connecting to mongo', err)
  });

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();

// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());




// Express View engine setup

app.use(require('node-sass-middleware')({
  src:  path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  sourceMap: true
}));
      

app.set('views', path.join(__dirname, 'views'));//can remove this
app.set('view engine', 'hbs'); //can remove this
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  cookie: { maxAge: 60000 },
  store: new MongoStore({
    mongooseConnection: mongoose.connection,
    ttl: 24 * 60 * 60 // 1 day
  })
}));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session())

app.use(cors({
  credentials: true,
  origin: ['process.env.CORS_ORIGIN']
}));

// default value for title local
app.locals.title = 'Express - Generated with Express Generator';



const index = require('./routes/index');
const authRoutes = require("./routes/auth-routes");
app.use('/', index);
app.use("/", authRoutes);



module.exports = app;
