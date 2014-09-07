module.exports.capitalize = function() {
    String.prototype.capitalize = function() {
        return this.charAt(0).toUpperCase() + this.slice(1);
    };
};
module.exports.returnJsonFromFile = function (file) {
    var file = __dirname + file;
    return JSON.parse(require('fs').readFileSync(file,'utf8'));
};
module.exports.isBlank = function() {
    String.prototype.isBlank = function() {
        return /^\s*$/.test(this);
    }
};
module.exports.randSuffix = function (length, current) {
    current = current || '';
    return length ? rand(--length, "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz".charAt(Math.floor(Math.random() * 60)) + current) : current;
};
module.exports.compareTo = function (array) {
    Array.prototype.compareTo = function (array) {
        // if the other array is a falsy value, return
        if (!array)
            return false;

        // compare lengths - can save a lot of time 
        if (this.length != array.length)
            return false;

        for (var i = 0, l=this.length; i < l; i++) {
            // Check if we have nested arrays
            if (this[i] instanceof Array && array[i] instanceof Array) {
                // recurse into the nested arrays
                if (!this[i].equals(array[i]))
                    return false;       
            }           
            else if (this[i] != array[i]) { 
                // Warning - two different object instances will never be equal: {x:20} != {x:20}
                return false;   
            }           
        }       
        return true;
    }
};