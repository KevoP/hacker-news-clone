/**
 * get the 20 most recent articles
 */
exports.article_list = function(req, res)
{
   res.send('Have not implemented article_list');
}

/**
 * Get the full data for an article
 */
exports.article_detail = function (req, res) {
   res.send('Have not implemented article_detail: ' + req.params.articleId);
}