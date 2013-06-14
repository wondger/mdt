/*
 * @name: log.js
 * @description: 
 * @author: wondger@gmail.com
 * @date: 2013-02-20
 * @param: 
 * @todo: 
 * @changelog: 
 */
var clc = require('cli-color');
var log = module.exports = {};

log.color = {
    info: function(msg) {
        return clc.xterm(250)(msg)
    },
    ok: function(msg) {
        return clc.xterm(22)(msg);
    },
    error: function(msg) {
        return clc.xterm(88)(msg);
    },
    hl: function(msg) {
        return clc.xterm(34)(msg);
    }
}

log.write = function(msg) {
    process.stdout.write(msg);
    return this;
}

log.writeln = function(msg) {
    this.write((msg || '') + '\n');
    return this;
};

log.info = function(msg) {
    this.write(log.color.info(msg));
    return this;
}

log.ok = function(msg) {
    this.write(log.color.ok(msg || 'OK'));
    return this;
};

log.error = function(msg) {
    this.write(log.color.error(msg || 'ERROR'));
    return this;
};

log.okln = function(msg) {
    this.ok(msg);
    this.write("\n");
    return this;
};

log.errorln = function(msg) {
    this.error(msg);
    this.write("\n");
}
