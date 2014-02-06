
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'NOAA Weather D3js Example' });
};
