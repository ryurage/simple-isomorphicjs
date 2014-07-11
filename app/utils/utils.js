module.exports.capitalize = function() {
	String.prototype.capitalize = function() {
	    return this.charAt(0).toUpperCase() + this.slice(1);
	};
};
module.exports.returnJsonFromFile = function(file) {
	var file = __dirname + file;
	return JSON.parse(require('fs').readFileSync(file,'utf8'));
};
module.exports.isBlank = function() {
	String.prototype.isBlank = function() {
    	return /^\s*$/.test(this);
	}
};
module.exports.randSuffix = function(length, current) {
    current = current || '';
    return length ? rand(--length, "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz".charAt(Math.floor(Math.random() * 60)) + current) : current;
}