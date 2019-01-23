const axios = require('axios');


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

function getItemById(itemId)
{
   let request = `https://hacker-news.firebaseio.com/v0/item/${itemId}.json?print=pretty`;
   return axios.get(request)
      .then(res => res.data)
      .catch(err => console.log('get Article error'));
}

function getItemPromise(itemId) {
   let request = `https://hacker-news.firebaseio.com/v0/item/${itemId}.json?print=pretty`;
   return axios.get(request);
}

/**
 * get the 20 most recent articles
 */
exports.article_list = function(req, res)
{
   getMostRecentArticles()
      .then( articles => {
         let templateData = { title: 'Hacker News', heading: 'Hacker News Clone', articles: articles };
         res.render('index', templateData);
      })
      .catch(err => {
         console.log(err);
         res.redirect('/error');
      });
}

/**
 * Get the full data for an article
 */
exports.article_detail = function (req, res) {
   if(!req.params.articleId){
      res.send('no article id sent');
   }

   getItemPromise(req.params.articleId)
      .then(article => {
         article.data
          // get comments
         let comments = article.data.kids.map(id => getItemPromise(id).then(comment => comment.data));
         // return an article object with nested comments data 
         return axios.all(comments)
            .then(comments => {
               return {article: article.data, comments: comments};
            });
      })
      .then(articleWithComments => {
         articleWithComments.title = articleWithComments.article.title;
         articleWithComments.heading = articleWithComments.article.title;
         // console.log('article with comments', articleWithComments);
         res.render('article', articleWithComments);
      })
      .catch(err => {
         console.log('Error getting article data', err);
      });
}

