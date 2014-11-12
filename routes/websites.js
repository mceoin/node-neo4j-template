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
    console.log("Website: " + Website)
    Website.create({
    // you can make arrays
        name: req.body['name'],
    },
    function (err, website) {
        if (err) return next(err);
        console.log("website id: " + website.id)
        console.log("website name: " + website.name)
        // res.redirect('/websites/' + website.id);
    });
};

/**
 * GET /websites/:id
 */
exports.show = function (req, res, next) {
    Website.get(req.params.id, function (err, website) {
        if (err) return next(err);
        // TODO also fetch and show followers? (not just follow*ing*)
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
 * POST /websites/:id
 */
exports.createandfollow = function (req, res, next) {
    console.log("Website: " + Website)
    Website.create({
    // you can make arrays
    // Website-function data
        name: req.body['name'],
    },
    // Website-function callback
    function (err, website) {
        if (err) return next(err);
        console.log("website id: " + website.id)
        console.log("website name: " + website.name)
        // res.redirect('/websites/' + website.id);
    });
};