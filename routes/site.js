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

    if (results !== null) {
      var nodeId = results[0]['id(n)']
        // get the id of the first result
          Website.get(nodeId, function (err, website) {
            console.log(err, website)
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
      } // end if (results !== null)
      else {
          Website.create({ // if search result doesn't exist - create one!
              // you can make arrays
                  name: nodeName,
              },
              function (err, website) {
                  if (err) return next(err);
                  res.redirect('/websites/' + website.id);
              });
            } // end else statement

   });
};

