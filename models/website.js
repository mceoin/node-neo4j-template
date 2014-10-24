// website.js
// Website model logic.

var neo4j = require('neo4j');
var db = new neo4j.GraphDatabase(
    process.env['NEO4J_URL'] ||
    process.env['GRAPHENEDB_URL'] ||
    'http://localhost:7474'
);

// private constructor:

var Website = module.exports = function Website(_node) {
    // all we'll really store is the node; the rest of our properties will be
    // derivable or just pass-through properties (see below).
    this._node = _node;
}

// public instance properties:

Object.defineProperty(Website.prototype, 'id', {
    get: function () { return this._node.id; }
});

Object.defineProperty(Website.prototype, 'name', {
    get: function () {
        return this._node.data['name'];
    },
    set: function (name) {
        this._node.data['name'] = name;
    }
});

// public instance methods:

Website.prototype.save = function (callback) {
    this._node.save(function (err) {
        callback(err);
    });
};

Website.prototype.del = function (callback) {
    // use a Cypher query to delete both this user and his/her following
    // relationships in one transaction and one network request:
    // (note that this'll still fail if there are any relationships attached
    // of any other types, which is good because we don't expect any.)
    var query = [
        'MATCH (website:Website)',
        'WHERE ID(website) = {websiteId}',
        'DELETE website',
        'WITH website',
        'MATCH (website) -[rel:follows]- (other)',
        'DELETE rel',
    ].join('\n')

    var params = {
        websiteId: this.id
    };

    db.query(query, params, function (err) {
        callback(err);
    });
};

Website.prototype.follow = function (other, callback) {
    this._node.createRelationshipTo(other._node, 'follows', {}, function (err, rel) {
        callback(err);
    });
};

Website.prototype.unfollow = function (other, callback) {
    var query = [
        'MATCH (website:Website) -[rel:follows]-> (other:Website)',
        'WHERE ID(website) = {websiteId} AND ID(other) = {otherId}',
        'DELETE rel',
    ].join('\n')

    var params = {
        websiteId: this.id,
        otherId: other.id,
    };

    db.query(query, params, function (err) {
        callback(err);
    });
};

// calls callback w/ (err, following, others) where following is an array of
// users this user follows, and others is all other users minus him/herself.
Website.prototype.getFollowingAndOthers = function (callback) {
    // query all users and whether we follow each one or not:
    var query = [
        'MATCH (website:Website), (other:Website)',
        'OPTIONAL MATCH (website) -[rel:follows]-> (other)',
        'WHERE ID(website) = {websiteId}',
        'RETURN other, COUNT(rel)', // COUNT(rel) is a hack for 1 or 0
    ].join('\n')

    var params = {
        websiteId: this.id,
    };

    var website = this;
    db.query(query, params, function (err, results) {
        if (err) return callback(err);

        var following = [];
        var others = [];

        for (var i = 0; i < results.length; i++) {
            var other = new Website(results[i]['other']);
            var follows = results[i]['COUNT(rel)'];

            if (website.id === other.id) {
                continue;
            } else if (follows) {
                following.push(other);
            } else {
                others.push(other);
            }
        }

        callback(null, following, others);
    });
};

// static methods:

Website.get = function (id, callback) {
    db.getNodeById(id, function (err, node) {
        if (err) return callback(err);
        callback(null, new Website(node));
    });
};

Website.getAll = function (callback) {
    var query = [
        'MATCH (website:Website)',
        'RETURN website',
    ].join('\n');

    db.query(query, null, function (err, results) {
        if (err) return callback(err);
        var websites = results.map(function (result) {
            return new Website(result['website']);
        });
        callback(null, websites);
    });
};

// creates the user and persists (saves) it to the db, incl. indexing it:
Website.create = function (data, callback) {
    // construct a new instance of our class with the data, so it can
    // validate and extend it, etc., if we choose to do that in the future:
    var node = db.createNode(data);
    var website = new Website(node);

    // but we do the actual persisting with a Cypher query, so we can also
    // apply a label at the same time. (the save() method doesn't support
    // that, since it uses Neo4j's REST API, which doesn't support that.)
    var query = [
        'CREATE (website:Website {data})',
        'RETURN website',
    ].join('\n');

    var params = {
        data: data
    };

    db.query(query, params, function (err, results) {
        if (err) return callback(err);
        var website = new Website(results[0]['website']);
        callback(null, website);
    });
};
