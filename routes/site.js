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

   var nodeName = req.body.name;


   Website.findNodeIdFromName(nodeName, function(err, results){
      var nodeId = results[0]['id(n)']
            console.log(err, results, "exports.searchcluster returned these")
            // res.send(results)

          Website.get(nodeId, function (err, website) {
            console.log(err, website, "line 30 works!")
              if (err) return next(err);
              website.getFollowingAndOthers(function (err, following, others) {
                  if (err) return next(err);
                  res.render('website', {
                      website: website,
                      following: following,
                      others: others
                  });
              });
       }); // Website.get end, purpose is to render webpage from id
   });
};

