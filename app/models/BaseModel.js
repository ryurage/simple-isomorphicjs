module.exports = function() {

	return {
		setDB: function(db) {
			this.db = db;
		},
		getlist: function(callback, query) {
			this.db.find(query || {}, function (err, doc) { callback(doc) });
		},
		update: function(data, callback) {
			this.db.update({_id: data._id}, data, {}, callback || function(){ });	
		},
		insert: function(data, callback) {
			this.db.insert( data, callback );
		},
		remove: function(_id, callback) {
			this.db.remove({_id: _id}, {}, callback);
		}
	}
};