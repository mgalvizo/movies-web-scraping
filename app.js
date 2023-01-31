const express = require('express');
const path = require('path');
const morgan = require('morgan');
const ejsMate = require('ejs-mate');
const livereload = require('livereload');
const connectLiveReload = require('connect-livereload');

const livereloadServer = livereload.createServer();
livereloadServer.server.once('connection', () => {
    setTimeout(() => {
        livereloadServer.refresh('/');
    }, 100);
});

const movieRouter = require('./routes/movieRoutes');

const app = express();

app.engine('ejs', ejsMate);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, 'public')));

app.use(
    express.urlencoded({
        // Allows nested object posting
        extended: true,
        limit: '10kb',
    })
);

app.use(connectLiveReload());

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

app.use('/movies', movieRouter);

app.get('/', (req, res) => {
    res.render('home');
});

module.exports = app;
