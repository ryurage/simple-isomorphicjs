var BaseController = require("./Base"),
	View = require("../views/Base"),
	model = new (require("../models/BaseModel")),
	defaultMenu = require('../utils/utils').returnJsonFromFile('/../config/default_menu.json');
require("../utils/utils").capitalize();

module.exports = BaseController.extend({ 
	name: "Page",
	content: null,
	run: function(type, req, res, next) {
		model.setDB(req.contentdb);
		var self = this;
		this.getContent(type, function() {
			var v = new View(res, 'inner');
			self.navMenu(req, res, function(navMenuMarkup){
				self.content.menunav = navMenuMarkup;
				v.render(self.content);
			});
		});
	},
	navMenu: function(req, res, callback) {
		var markup = '',
			menuArr = [];
		
		defaultMenu.forEach( function(obj){
		    markup += '<li><a href="' + obj.uri + '">' + obj.name.capitalize() + '</a></li>';
		    menuArr.push(obj.name);
		});
		model.getlist(function(contents) {		
			if (contents.length > 0) {
				for(var i=0; record = contents[i]; i++) {
					if (menuArr.indexOf(record.type) == -1) {
						markup += '<li><a href="/' + record.type + '">' + record.type.capitalize() + '</a></li>';
					}
				}
			}
			res.render('menu-nav', {menumarkup: markup}, function(err, html) {
				callback(html);
			});
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