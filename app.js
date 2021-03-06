const express = require('express');

const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');

const bodyParser = require('body-parser');
const axios = require('axios');
const router = express.Router();

/**
 * import the routes
 */
const indexRouter = require('./routes/index');
const storyRouter = require('./routes/story');
const newRouter = require('./routes/new');

const app = express();

/**
 * setup the views
 */
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middleware
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// routes
app.use('/', indexRouter);
app.use('/', storyRouter);
app.use('/', newRouter);

// app.get('/favicon.ico', (req, res) => res.status(204));

// catch 404s
app.use((req, res, next) => {
   const err = new Error('Not Found');
   err.status = 404;
   next(err);
});

// catch errors
app.use(function(err, req, res, next){
   res.locals.message = err.message;
   res.locals.error = req.app.get('env') === 'development' ? err : {};

   console.log(err);

   // render the error page
   res.status(err.status || 500);
   res.render('error', {title: '404 - page not found'});
});









/**********************************
 * functions returning promises 
 **********************************/
// function getItemPromise(itemId) {
//    let request = `https://hacker-news.firebaseio.com/v0/item/${itemId}.json?print=pretty`;
//    return axios.get(request);
// }

/**********************************
 * routes using promises
 **********************************/
/**
 * getUser
 */
// function getUser(userName)
// {
//    let request = `https://hacker-news.firebaseio.com/v0/item/${userName}.json?print=pretty`;
//    return axios.get(request)
//       .then(res => res.data)
//       .catch(err => console.log(err));
// }


// app.get('/', (req, res) => {

//    getMostRecentstories()
//       .then( stories => {
//          let templateData = { title: 'Home', heading: 'Hacker News Clone', stories: stories };
//          res.render('index', templateData);
//       })
//       .catch(err => {
//          console.log(err);
//          res.redirect('/error');
//       });
// });


// app.get('/news', (req, res) => {
//    res.render('index', { title: 'News', heading: 'On the news page' });
// });

// app.get('/comments', (req, res) => {
//    res.render('index', { title: 'Comments Page', heading: 'On the Comments page' });
// });

// app.get('/show', (req, res) => {
//    res.render('index', { title: 'Show Page', heading: 'On the Show page' });
// });

// app.get('/ask', (req, res) => {
//    res.render('index', { title: 'Ask Page', heading: 'On the Ask page' });
// });

// app.get('/jobs', (req, res) => {
//    res.render('index', { title: 'Jobs Page', heading: 'On the Jobs page' });
// });

// app.get('/submit', (req, res) => {
//    res.render('index', { title: 'Submit Page', heading: 'On the Submit page' }); 
// });



/**
 * getItemPromise
 * Asycn/await
 * @param {int} itemId 
 */
// const getItemAsync = async (itemId) => {
//    return axios.get(`https://hacker-news.firebaseio.com/v0/item/${itemId}.json?print=pretty`)
//       .then(res => res.data);
// }

// const getMostRecentIdsAsync = async () => {
//    return axios.get(`https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty`)
//       .then(res => res.data);
// }

// const getMostRecentAsync = async (numberstories = 20) => {
//    const recentIds = await getMostRecentIdsAsync();
//    return Promise.all(recentIds.slice(0, numberstories)
//       .map( storyId => getItemAsync(storyId)));
// }

// app.get('/async', (req, res) => {
//    getMostRecentAsync(4)
//       .then(stories => {
//          let templateData = { title: 'Home', heading: 'Hacker News Clone', stories: stories };
//          res.render('index', templateData);
//       })
//       .catch(err => {
//          console.log(err);
//          res.redirect('/error');
//       });
// });


/****************************************************************************
 * End Async/Await stuff
 */
app.listen(3000, () => {
   console.log('listening on 3000');
});

module.exports = app;