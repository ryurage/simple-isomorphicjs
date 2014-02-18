var BaseController = require("./Base"),
	View = require("../views/Base"),
	model = new (require("../models/ContentModel")),
	navModel = require("../models/MenuPageModel"),
	crypto = require("crypto"),
	fs = require("fs");

module.exports = BaseController.extend({ 
	name: "Admin",
	username: "admin",
	password: "admin",
	run: function(req, res, next) {
		var self = this;
		if(this.authorize(req)) {
			model.setDB(req.db);
			navModel.setDB(req.navpagedb)
			req.session.fastdelivery = true;
			req.session.save();
			var v = new View(res, 'admin');
			self.del(req, function() {
				self.form(req, res, function(formMarkup) {
					self.list(function(listMarkup) {
						self.navItem(req, res, function(navItemMarkup){
							v.render({
								title: 'Administration',
								content: 'Welcome to the control panel',
								navitem: navItemMarkup,
								list: listMarkup,
								form: formMarkup
							});
						});
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
		navModel.getlist(function(navpages) {
			var markup = '<table>';
			markup += '\
				<tr>\
					<td><strong>type</strong></td>\
					<td><strong>title</strong></td>\
					<td><strong>picture</strong></td>\
					<td><strong>actions</strong></td>\
				</tr>\
			';
			for(var i=0; navpage = navpages[i]; i++) {
				markup += '\
				<tr>\
					<td>' + navpage.type + '</td>\
					<td>' + navpage.title + '</td>\
					<td><img class="list-picture" src="' + navpage.pictureTag + '" /></td>\
					<td>\
						<a href="/admin?action=delete&id=' + navpage._id + '">delete</a>&nbsp;&nbsp;\
						<a href="/admin?action=edit&id=' + navpage._id + '">edit</a>\
					</td>\
				</tr>\
			';
			}
			markup += '</table>';
			callback(markup);
		});
	},
	navItem: function(req, res, callback) {
		var returnNavForm = function() {
			res.render('admin-navitem', {}, function(err, html) {
				callback(html);
			});
		};
		if(req.body && req.body.navpagesubmitted && req.body.navpagesubmitted === 'yes') {
			var data = { navitem: req.body.navitem };
			navModel.insert( data, function() {
				returnNavForm();
			});
		} else {
			returnNavForm();
		}
	},
	form: function(req, res, callback) {
		var returnTheForm = function() {
			if(req.query && req.query.action === "edit" && req.query.id) {
				navModel.getlist(function(navpages) {
					if (navpages.length > 0) {
						var navpage = navpages[0];
						res.render('admin-record', {
							ID: navpage._id,
							text: navpage.text,
							title: navpage.title,
							type: '<option value="' + navpage.type + '">' + navpage.type + '</option>',
							picture: navpage.picture,
							pictureTag: navpage.picture != '' ? '<img class="list-picture" src="' + navpage.picture + '" />' : ''
						}, function(err, html) {
							callback(html);
						});
					} else {
						res.render('admin-record', {}, function(err, html) {
							callback(html);
						});
					}
				}, {_id: req.query.id});
			} else {
				res.render('admin-record', {}, function(err, html) {
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
			navModel[req.body.ID != '' ? 'update' : 'insert']( data, function() {
				returnTheForm();
			});
		} else {
			returnTheForm();
		}
	},
	del: function(req, callback) {
		if(req.query && req.query.action === "delete" && req.query.id) {
			navModel.remove(req.query.id, callback);
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