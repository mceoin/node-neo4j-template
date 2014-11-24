
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index');
};


exports.searchcluster = function (req, res) {
   console.log("searching cluster...", req.body)
   req.body
};

// /**
//  * GET /websites/:id
//  */
// exports.show = function (req, res, next) {
//     Website.get(req.params.id, function (err, website) {
//         if (err) return next(err);
//         website.getFollowingAndOthers(function (err, following, others) {
//             if (err) return next(err);
//             res.render('website', {
//                 website: website,
//                 following: following,
//                 others: others
//             });
//         });
//     });
// };