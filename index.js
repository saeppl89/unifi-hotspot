// dependencies  ===============================================================
const express = require('express');
const session = require('express-session');
const app = express();

// middleware
const logRequestStart = (req, res, next) => {
  console.info(`${req.method} ${req.originalUrl}`);
  next();
};
app.use(logRequestStart);
app.use(express.static('public'));
app.use(session({
  secret: process.env.SECRET,
  resave: true,
  saveUninitialized: true
}));

// routes ======================================================================

app.use(`/guest/s/${process.env.SITENAME}/`, require('./src/routes/index.js')());
app.use('/authorise', require('./src/routes/authorize.js')());

// launch ======================================================================
app.listen(4545, function (err) {
  console.log('running server on port 4545');
});
