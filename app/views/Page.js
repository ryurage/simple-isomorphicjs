var View = require("./Base");
view = new View();

module.exports = view.extend({ 
	render: function(data) {
		if(this.response && this.template) {
			console.log('..........',data)
			var that = this;
			this.response.render(this.template, {layout: false}, function(err, html){
			  	var response = that.data;
			  	that.response.send(response);
			});
			console.log('testing*************')
		}	
	}
});