// websites.js
// Routes to CRUD websites.

var Website = require('../models/website');

/**
 * GET /websites
 */
exports.list = function (req, res, next) {
    Website.getAll(function (err, websites) {
        if (err) return next(err);
        res.render('websites', {
            websites: websites
        });
    });
};

/**
 * POST /websites
 */
exports.create = function (req, res, next) {
    // console.log("Website: " + Website)
    Website.create({
    // you can make arrays
        name: req.body['name'],
    },
    function (err, website) {
        if (err) return next(err);
        // console.log("website id: " + website.id)
        // console.log("website name: " + website.name)
        res.redirect('/websites/' + website.id);
    });
};

/**
 * GET /websites/:id
 */
exports.show = function (req, res, next) {
    Website.get(req.params.id, function (err, website) {
        if (err) return next(err);
        website.getFollowingAndOthers(function (err, following, others) {
            if (err) return next(err);
            res.render('website', {
                website: website,
                following: following,
                others: others
            });
        });
    });
};

/**
 * POST /websites/:id
 */
exports.edit = function (req, res, next) {
    Website.get(req.params.id, function (err, website) {
        if (err) return next(err);
        website.name = req.body['name'];
        website.save(function (err) {
            if (err) return next(err);
            res.redirect('/websites/' + website.id);
        });
    });
};

/**
 * DELETE /websites/:id
 */
exports.del = function (req, res, next) {
    Website.get(req.params.id, function (err, website) {
        if (err) return next(err);
        website.del(function (err) {
            if (err) return next(err);
            res.redirect('/websites');
        });
    });
};

/**
 * POST /websites/:id/follow
 */
exports.follow = function (req, res, next) {
    Website.get(req.params.id, function (err, website) {
        if (err) return next(err);
        Website.get(req.body.website.id, function (err, other) {
            if (err) return next(err);
            website.follow(other, function (err) {
                if (err) return next(err);
                res.redirect('/websites/' + website.id);
            });
        });
    });
};

/**
 * POST /websites/:id/unfollow
 */
exports.unfollow = function (req, res, next) {
    Website.get(req.params.id, function (err, website) {
        if (err) return next(err);
        Website.get(req.body.website.id, function (err, other) {
            if (err) return next(err);
            website.unfollow(other, function (err) {
                if (err) return next(err);
                res.redirect('/websites/' + website.id);
            });
        });
    });
};

/**
 * POST /websites/:id/createandfollow
 */
exports.createandfollow = function (req, res, next) {
    // params of the new node being created
    var paramsId = req.params.id
    Website.create({
        name: req.body['name'],
    },
    function (err, website) {
        if (err) return next(err);
        // website id of page you are on.
        var websiteId = website.id
        Website.get(paramsId, function (err, website) {
            if (err) return next(err);
            Website.get(websiteId, function (err, other) {
                if (err) return next(err);
                website.follow(other, function (err) {
                    if (err) return next(err);
                    // redirect back to original website
                    res.redirect('/websites/' + paramsId);
                });
            });
        });
    });
};