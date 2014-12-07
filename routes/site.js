// site.js
// Routes to Search cluster database

var Website = require('../models/website');

/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index');
};

/*
 * POST home page. -> search cluster for association
 */

exports.searchcluster = function (req, res, next) {
   console.log("searching cluster...", req.body)
   var nodeName = req.body.name
   Website.findNodeIdFromName(nodeName)

   // Website.get(req.body.name, function (err, website) {
   //      if (err) return next(err);
   //      website.getFollowingAndOthers(function (err, following, others) {
   //          if (err) return next(err);
   //          res.render('website', {
   //              website: website,
   //              following: following,
   //              others: others
   //          });
   //      });
   //  });

};