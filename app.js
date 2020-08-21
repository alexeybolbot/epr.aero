require('dotenv').config();
const express = require('express');
const fileUpload = require('express-fileupload');
const checkAuth = require('./middleware/checkAuth');
const refreshToken = require('./middleware/refreshToken');

const signinRouter = require('./routes/signin');
const signupRouter = require('./routes/signup');
const infoRouter = require('./routes/info');
const logoutRouter = require('./routes/logout');
const fileRouter = require('./routes/file');

const app = express();

app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
    next();
});
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(fileUpload());

app.use('/signin', signinRouter);
app.use('/signup', signupRouter);
app.use('/file', checkAuth, refreshToken, fileRouter);
app.use('/info', checkAuth, refreshToken, infoRouter);
app.use('/logout', checkAuth, logoutRouter);

module.exports = app;
