var BaseController = require("./Base"),
	View = require("../views/Base"),
	contentModel = new (require("../models/BaseModel")),
	menuModel = new (require("../models/BaseModel")),
	crypto = require("crypto"),
	fs = require("fs"),
	menuHandler = require('./MenuHandler'),
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
		var menuitems = menuHandler.getMenuList(),
			markup = '';
		menuitems.map( function(item) {
			markup += '<option value="' + item + '">' + item + '</option>';
		});
		callback(markup);
	},
	menuItem: function(req, res, callback) {
		var returnMenuForm = function() {
			res.render('admin-menuitem', {}, function(err, html) {
				callback(html);
			});
		};

		returnMenuForm();
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
							//picture: content.picture,
							//pictureTag: content.picture != '' ? '<img class="list-picture" src="' + content.picture + '" />' : '',
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
				asset_obj: this.updateAssetObject(req),
				_id: req.body.ID
			};
			/*contentModel[req.body.ID != '' ? 'update' : 'insert']( data, function() {
				returnTheForm();
			});*/
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
		var arr = [], obj, data, fileName, uid, dir;
		if(!req.files || req.files === '') {
			return req.body.currentPicture || '';
		}
		for (var key in req.files) {
			if (req.files.hasOwnProperty(key)) {
				var obj = req.files[key];
				if (obj.hasOwnProperty('name') && obj.name !== ''){
			      	fileName = obj.name;
			      	data = fs.readFileSync(obj.path);
					uid = crypto.randomBytes(10).toString('hex');
					dir = __dirname + "/../public/uploads/" + uid;
					//fs.mkdirSync(dir, '0777');
					//fs.writeFileSync(dir + "/" + fileName, data);
					obj = {};
					obj[fileName] = '/uploads/' + uid + "/" + fileName;
					arr.push(obj);
			    }
		   	}
		}
		return arr;
	},
	updateAssetObject: function(req){
		var pictures = this.handleFileUpload(req),
			asset_obj = JSON.parse(req.body.asset_obj);
			
		asset_obj.images.forEach(function (key) { // add a URI to the asset object
    		var ao = key;
		    pictures.forEach(function (key){
		        var pic = key,
		            addr = pic[ao['img_name']];
		        if (addr) {
		            ao['uri'] = addr;
		        }
		    });
		});
		return JSON.stringify(asset_obj);
	}
});