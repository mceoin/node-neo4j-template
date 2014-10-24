// users.js
// Routes to CRUD users.

var Website = require('../models/website');

/**
 * GET /users
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
 * POST /users
 */
exports.create = function (req, res, next) {
    Website.create({
        name: req.body['name']
    }, function (err, website) {
        if (err) return next(err);
        res.redirect('/websites/' + website.id);
    });
};

/**
 * GET /users/:id
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
 * POST /users/:id
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
 * DELETE /users/:id
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
 * POST /users/:id/follow
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
 * POST /users/:id/unfollow
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
