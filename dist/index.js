"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var _expressSession = _interopRequireDefault(require("express-session"));

var _swaggerUiExpress = _interopRequireDefault(require("swagger-ui-express"));

var _cors = _interopRequireDefault(require("cors"));

var _errorhandler = _interopRequireDefault(require("errorhandler"));

var _dotenv = _interopRequireDefault(require("dotenv"));

var _morgan = _interopRequireDefault(require("morgan"));

var _passport = _interopRequireDefault(require("passport"));

var _routes = _interopRequireDefault(require("./routes"));

var _swagger = _interopRequireDefault(require("./swagger.json"));

require("./config/passport");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_dotenv.default.config();

const isProduction = process.env.NODE_ENV === 'production';
const PORT = process.env.PORT || 3000; // create global app object

const app = (0, _express.default)();
app.use((0, _cors.default)());
app.use(_express.default.urlencoded({
  extended: true
}));
app.use(_express.default.json());
app.use((0, _morgan.default)('dev'));
app.use(_passport.default.initialize());
app.use((0, _expressSession.default)({
  secret: 'authorshaven',
  cookie: {
    maxAge: 60000
  },
  resave: false,
  saveUninitialized: false
}));
app.use('/swagger', _swaggerUiExpress.default.serve, _swaggerUiExpress.default.setup(_swagger.default));

if (!isProduction) {
  app.use((0, _errorhandler.default)());
}

app.use(_routes.default); // setting up the root endpoint for the testing

app.get('/', (req, res) => {
  res.status(200).send({
    message: 'Welcome to Authors Haven'
  });
}); // / catch 404 and forward to error handler

app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
}); // development error handler
// will print stacktrace

if (!isProduction) {
  app.use((err, req, res, next) => {
    if (err.message === 'Failed to fetch user profile') {
      res.status(err.status || 500);
      res.json({
        errors: {
          message: `${err.message}, please check your connection`
        }
      });
    }

    if (err.message === 'Invalid Credentials') {
      res.status(err.status || 500);
      res.json({
        errors: {
          message: `${err.message}, access denied, please sign in again`
        }
      });
    }

    next();
  });
} // production error handler
// no stack traces leaked to user


app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    errors: {
      message: err.message,
      error: {}
    }
  });
  next();
}); // Create or Update database tables and start express server

app.listen(PORT, () => {
  console.log(`Server running on port:${PORT}`);
});
var _default = app;
exports.default = _default;