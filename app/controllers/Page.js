var BaseController = require("./Base"),
	View = require("../views/Base"),
	model = new require("../models/BaseModel");

module.exports = BaseController.extend({ 
	name: "Page",
	content: null,
	run: function(type, req, res, next) {
		model.setDB(req.contentdb);
		var self = this;
		this.getContent(type, function() {
			var v = new View(res, 'inner');
			v.render(self.content);

		});
	},
	getContent: function(type, callback) {
		var self = this;
		this.content = {}
		model.getlist(function(records) {
			if(records.length > 0) {
				self.content = records[0];
			}
			callback();
		}, { type: type });
	}
});