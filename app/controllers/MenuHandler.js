var model = new (require("../models/BaseModel"));
require("../utils/utils").isBlank();

// menuitems is cached here in this module. You can make an initial load from db instead.
var menulist = [];
// getting them is simple, always just get the current array. We'll use that.
var getMenuList = function() {
    return menulist;
}

var setMenuListFromDB = function(db) { 
    model.setDB(db)
    model.getlist( function (menuitems){ 
        for(var i=0; item = menuitems[i]; i++) {
            menulist.push(item.menuitem);
        }
    });
}
var addMenuItemHandler = function(newItem, callback) {
    menulist.push(newItem);
    callback();
}
// this one accepts a request to add a new menuitem
var addMenuItem = function(req, res, callback) {
    if (!req.body.menuitem.isBlank()) {
        var newItem = { menuitem: req.body.menuitem };
        // it will do db insert
        model.insert( newItem, function(err) {
            if (err) { // gotta be unique
                console.log('Whoa there...',err.message);
                callback();
            } else {
                addMenuItemHandler(newItem.menuitem, function(){
                    console.log('Added. Time to do the callback');
                    callback();
                });
            }
        });
    } else {
        console.log('Input was blank.')
    }
};

module.exports = {
    getMenuList: getMenuList,
    addMenuItemHandler: addMenuItemHandler,
    addMenuItem: addMenuItem,
    setMenuListFromDB: setMenuListFromDB
}