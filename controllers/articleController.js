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

/**
 * get the 20 most recent articles
 */
exports.article_list = function(req, res)
{
   console.log('a thing');

   getMostRecentArticles()
      .then( articles => {
         let templateData = { title: 'Home', heading: 'Hacker News Clone', articles: articles };
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
   res.send('Have not implemented article_detail: ' + req.params.articleId);
}

