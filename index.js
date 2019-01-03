const express = require('express');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
const axios = require('axios');
const router = express.Router();

// point to the views directory and use ejs
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middleware?
app.use(bodyParser.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

// catch 404s
// app.use((req, res, next) => {
//    const err = new Error('Not Found');
//    err.status = 404;
//    next(err);
// });

/**
 * getItemById
 * @description get the full data for a single article by its ID
 * @param {int} itemId 
 */
function getItemById(itemId)
{
   let request = `https://hacker-news.firebaseio.com/v0/item/${itemId}.json?print=pretty`;
   return axios.get(request)
      .then(res => res.data)
      .catch(err => console.log('get Article error'));
}


function getMostRecentArticles()
{
   return axios.get('https://hacker-news.firebaseio.com/v0/topstories.json?print=pretty')
      .then(res => res.data)
      .then(data => {
         let promises = [];
         data.slice(0, 20).forEach(id => {
            promises.push(getItemById(id));
         });
         return Promise.all(promises);
      });
}

async function getComment(commentId)
{
   try{
      return axios.get(`https://hacker-news.firebaseio.com/v0/item/${commentId}.json?print=pretty`);
   } catch(error) {
      console.log(error);
   }
}

/**
 * getUser
 */
function getUser(userName)
{
   let request = `https://hacker-news.firebaseio.com/v0/item/${userName}.json?print=pretty`;
   return axios.get(request)
      .then(res => res.data)
      .catch(err => console.log(err));
}


app.get('/', (req, res) => {

   getMostRecentArticles()
      .then( articles => {
         let templateData = { title: 'Home', heading: 'Hacker News Clone', articles: articles };
         res.render('index', templateData);
      })
      .catch(err => {
         console.log(err);
         res.redirect('/error');
      });
});

app.get('/article/:articleId', (req, res) => {
   getItemById(req.params.articleId)
      .then(article => {
         let promises = [];
         article.kids.slice(0, 5).forEach(id => {
            promises.push(getItemById(id));
         });
         return { title: 'title', heading: 'heading', article: article, comments: Promise.all(promises), nope: 'whut?'};
      })
      .then(templateData => {
         res.render('article', templateData);
      })
      .catch(err => {
         res.redirect('/error', err);
      });
});



app.get('/news', (req, res) => {
   res.render('index', { title: 'News', heading: 'On the news page' });
});

app.get('/comments', (req, res) => {
   res.render('index', { title: 'Comments Page', heading: 'On the Comments page' });
});

app.get('/show', (req, res) => {
   res.render('index', { title: 'Show Page', heading: 'On the Show page' });
});

app.get('/ask', (req, res) => {
   res.render('index', { title: 'Ask Page', heading: 'On the Ask page' });
});

app.get('/jobs', (req, res) => {
   res.render('index', { title: 'Jobs Page', heading: 'On the Jobs page' });
});

app.get('/submit', (req, res) => {
   res.render('index', { title: 'Submit Page', heading: 'On the Submit page' }); 
});

app.listen(3000, () => {
   console.log('listening on 3000');
});