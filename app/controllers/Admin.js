var BaseController = require("./Base"),
	View = require("../views/Base"),
	contentModel = new (require("../models/BaseModel")),
	menuModel = new (require("../models/BaseModel")),
	crypto = require("crypto"),
	fs = require("fs"),
	defaultMenu = require('../utils/utils').returnJsonFromFile('/../config/default_menu.json');

module.exports = BaseController.extend({ 
	name: "Admin",
	username: "admin",
	password: "admin",
	run: function(req, res, next) {
		var self = this;
		if(this.authorize(req)) {
			contentModel.setDB(req.contentdb)
			menuModel.setDB(req.menudb)
			req.session.fastdelivery = true;
			req.session.save();
			var v = new View(res, 'admin');
			self.del(req, function() {
				self.menuItem(req, res, function(menuItemMarkup){
					self.menuList(function(menuListMarkup){
						self.form(req, res, function(formMarkup) {
							self.list(function(listMarkup) {
								v.render({
									title: 'Administration',
									content: 'Welcome to the control panel',
									menuitem: menuItemMarkup,
									list: listMarkup,
									form: formMarkup
								});
							});
						}, menuListMarkup);  // give the form the menu list
					});
				}); 
			});
		} else {
			var v = new View(res, 'admin-login');
			v.render({
				title: 'Please login'
			});
		}		
	},
	authorize: function(req) {
		return (
			req.session && 
			req.session.fastdelivery && 
			req.session.fastdelivery === true
		) || (
			req.body && 
			req.body.username === this.username && 
			req.body.password === this.password
		);
	},
	list: function(callback) {
		contentModel.getlist(function(contents) {
			var markup = '<table>';
			markup += '\
				<tr>\
					<td><strong>type</strong></td>\
					<td><strong>title</strong></td>\
					<td><strong>picture</strong></td>\
					<td><strong>actions</strong></td>\
				</tr>\
			';
			for(var i=0; content = contents[i]; i++) {
				markup += '\
				<tr>\
					<td>' + content.type + '</td>\
					<td>' + content.title + '</td>\
					<td><img class="list-picture" src="' + content.picture + '" /></td>\
					<td>\
						<a href="/admin?action=delete&id=' + content._id + '">delete</a>&nbsp;&nbsp;\
						<a href="/admin?action=edit&id=' + content._id + '">edit</a>\
					</td>\
				</tr>\
			';
			} 
			markup += '</table>';
			callback(markup);
		});
	},
	menuList: function(callback) {
		menuModel.getlist(function(menuitems) {
			var markup = '';
			for(var i=0; item = menuitems[i]; i++) {
				markup += '<option value="' + item.menuitem + '">' + item.menuitem + '</option>';
			}
			callback(markup);
		});
	},
	menuItem: function(req, res, callback) {
		var returnMenuForm = function() {
			res.render('admin-menuitem', {}, function(err, html) {
				callback(html);
			});
		};
		if(req.body && req.body.menuitemsubmitted && req.body.menuitemsubmitted === 'yes') {
			var data = { menuitem: req.body.menuitem };
			menuModel.insert( data, function(err) {
				if (err) {
					console.log('Whoa there...',err.message);
					returnMenuForm();
				} else {
					console.log('data inserted to menuItem::::>> ',data)
					returnMenuForm();
				}
			});
		} else {
			returnMenuForm();
		}
	},
	form: function(req, res, callback, menu) {
		var menuItems = '';
		defaultMenu.forEach(function(obj) { menuItems += '<option>' + obj.name + '</option>'; });

		var returnTheForm = function() {
			if(req.query && req.query.action === "edit" && req.query.id) {
				contentModel.getlist(function(contents) {
					if (contents.length > 0) {
						var content = contents[0];
						res.render('admin-record', {
							ID: content._id,
							text: content.text,
							title: content.title,
							type: '<option value="' + content.type + '">' + content.type + '</option>',
							picture: content.picture,
							pictureTag: content.picture != '' ? '<img class="list-picture" src="' + content.picture + '" />' : '',
							defaultmenu: menuItems,
							menulist: menu
						}, function(err, html) {
							callback(html);
						});
					} else {
						res.render('admin-record', { 
							defaultmenu: menuItems,
							menulist: menu 
						}, function(err, html) {
							callback(html);
						});
					}
				}, {_id: req.query.id});
			} else {
				res.render('admin-record', { 
					defaultmenu: menuItems,
					menulist: menu 
				}, function(err, html) {
					callback(html);
				});
			}
		}
		if(req.body && req.body.formsubmitted && req.body.formsubmitted === 'yes') {
			var data = {
				title: req.body.title,
				text: req.body.text,
				type: req.body.type,
				picture: this.handleFileUpload(req),
				_id: req.body.ID
			};
			contentModel[req.body.ID != '' ? 'update' : 'insert']( data, function() {
				returnTheForm();
			});
		} else {
			returnTheForm();
		}
	},
	del: function(req, callback) {
		if(req.query && req.query.action === "delete" && req.query.id) {
			contentModel.remove(req.query.id, callback);
		} else {
			callback();
		}
	},
	handleFileUpload: function(req) {
		if(!req.files || !req.files.picture || !req.files.picture.name) {
			return req.body.currentPicture || '';
		}
		var data = fs.readFileSync(req.files.picture.path);
		var fileName = req.files.picture.name;
		var uid = crypto.randomBytes(10).toString('hex');
		var dir = __dirname + "/../public/uploads/" + uid;
		fs.mkdirSync(dir, '0777');
		fs.writeFileSync(dir + "/" + fileName, data);
		return '/uploads/' + uid + "/" + fileName;
	}
});