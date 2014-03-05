var BaseController = require("./Base"),
	View = require("../views/Base"),
	model = new (require("../models/BaseModel")),
	defaultMenu = require('../utils/utils').returnJsonFromFile('/../config/default_menu.json');
require("../utils/utils").capitalize();

module.exports = BaseController.extend({ 
	name: "Home",
	content: null,
	run: function(req, res, next) {
		model.setDB(req.contentdb);
		var self = this;
		this.getContent(function() {
			var v = new View(res, 'home');
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
	getContent: function(callback) {
		var self = this;
		this.content = {};
		model.getlist(function(records) {
			if(records.length > 0) {
				self.content.bannerTitle = records[0].title;
				self.content.bannerText = records[0].text;
			} else {
				self.content.bannerText = "<em>Stay tuned: information is on the way!</em>";
			}
			model.getlist(function(records) {
				var blogArticles = '';
				if(records.length > 0) {
					var to = records.length < 5 ? records.length : 4;
					for(var i=0; i<to; i++) {
						var record = records[i];
						blogArticles += '\
							<div class="item">\
	                            <img src="' + record.picture + '" alt="" />\
	                            <a href="/blog/' + record._id + '">' + record.title + '</a>\
	                        </div>\
						';
					}
				}
				//console.log('menuNav: ',menuNav.run(req, res, next))

				self.content.blogArticles = blogArticles;
				callback();
			}, { type: 'blog' });
		}, { type: 'home' });
	}
});