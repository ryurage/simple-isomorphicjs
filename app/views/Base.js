module.exports = function(response, template) {
	this.response = response;
	this.template = template;
};
module.exports.prototype = {
	extend: function(properties) {
		var Child = module.exports;
		Child.prototype = module.exports.prototype;
		for(var key in properties) {
			Child.prototype[key] = properties[key];
		}
		return Child;
	},
	render: function(data) {
		if(this.response && this.template) {
			this.response.contentType('text/html');
			/*data.text = data.text.replace(/\r\n/g, '<br />');
			var that = this;
			data.layout = false;
			this.response.render(this.template, data, function(err, html){
			   	that.response.send(html);
			   	console.log('template======',that.template,'html=============',html)
			});*/
			this.response.render(this.template, data);
		} else {
			//console.log('response: ',data)
		}
	}
}