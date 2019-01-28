const axios = require('axios');

function getNewStories() {
   return axios.get('https://hacker-news.firebaseio.com/v0/newstories.json?print=pretty')
      .then(res => res.data)
      .then(data => {
         let promises = [];
         data.slice(0, 20).forEach(id => {
            promises.push(getItemById(id));
         });
         return Promise.all(promises);
      });
}

function getTopStories()
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
      .catch(err => console.log('get story error'));
}

function getItemPromise(itemId) {
   let request = `https://hacker-news.firebaseio.com/v0/item/${itemId}.json?print=pretty`;
   return axios.get(request);
}

function extractHostname(url) {
   var hostname;
   //find & remove protocol (http, ftp, etc.) and get hostname
   if (url.indexOf("//") > -1) {
      hostname = url.split('/')[2];
   }
   else {
      hostname = url.split('/')[0];
   }

   //find & remove port number
   hostname = hostname.split(':')[0];
   //find & remove "?"
   hostname = hostname.split('?')[0];

   return hostname;
}

/**
 * get the 20 most recent stories
 */
exports.top_story_list = function(req, res)
{
   getTopStories()
      .then( stories => {
         stories.forEach(story => {
            story.source = extractHostname(story.url);
         });
         let templateData = { title: 'Hacker News', heading: 'Hacker News Clone', stories: stories };
         res.render('index', templateData);
      })
      .catch(err => {
         console.log(err);
         res.redirect('/error');
      });
}

/**
 * get the 20 most recent stories
 */
exports.new_story_list = function (req, res) 
{
   console.log('in new story list');
   getNewStories()
      .then(stories => {
         stories.forEach(story => {
            story.source = extractHostname(story.url);
         });
         let templateData = { title: 'Hacker News', heading: 'Hacker News Clone', stories: stories };
         res.render('index', templateData);
      })
      .catch(err => {
         console.log(err);
         res.redirect('/error');
      });
}


/**
 * Get the full data for an story
 */
exports.story_detail = function (req, res) {
   if(!req.params.storyId){
      res.send('no story id sent');
   }

   getItemPromise(req.params.storyId)
      .then(story => {
         console.log(story.data);

         // get comments
         if (!Array.isArray(story.data.kids))
            return {story: story.data, comments: []};

         let comments = story.data.kids.map(id => getItemPromise(id).then(comment => comment.data));
         // return an story object with nested comments data 
         return axios.all(comments)
            .then(comments => {
               return {story: story.data, comments: comments};
            });
            
      })
      .then(storyWithComments => {
         storyWithComments.title = storyWithComments.story.title;
         storyWithComments.heading = storyWithComments.story.title;
         // console.log('story with comments', storyWithComments);
         res.render('story', storyWithComments);
      })
      .catch(err => {
         console.log('Error getting story data', err);
      });
}

