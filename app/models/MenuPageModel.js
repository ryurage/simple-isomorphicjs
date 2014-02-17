module.exports = function(db) {
	this.db = db;
};
var MenuPageModel = module.exports.prototype = {
	setDB: function(db) {
		this.db = db;
	},
	getlist: function(callback, query) {
		this.db.find({}, function (err, doc) { callback(doc) });
	},
	insert: function(data, callback) {
		this.db.insert( data, callback );
	}
};
module.exports = MenuPageModel;