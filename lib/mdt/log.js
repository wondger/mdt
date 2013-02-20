/*
 * @name: log.js
 * @description: 
 * @author: wondger@gmail.com
 * @date: 2013-02-20
 * @param: 
 * @todo: 
 * @changelog: 
 */
var log = module.exports = {};

log.write = function(msg) {
    process.stdout.write(msg);
    return this;
}

log.writeln = function(msg) {
    this.write((msg || '') + '\n');
    return this;
};

log.ok = function(msg) {
    return this.writeln(msg || 'OK');
};

log.error = function(msg) {
    return this.writeln(msg || 'ERROR');
};
