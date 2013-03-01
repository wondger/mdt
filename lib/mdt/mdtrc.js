/*
 * @name: mdtrc.js
 * @description: parse head meta
 * @author: wondger@gmail.com
 * @date: 2013-02-21
 * @param: 
 * @todo: 
 * @changelog: 
 */
"use strict";

var path = require("path");
var file = require("./file");

var mdtrc = module.exports = {};

/*
 * find .mdtrc dir
 * find it in cwd. and then parent. and ....
 */
mdtrc._dir = function(cwd){
    if (!cwd) {
        cwd = process.cwd();
    }

    if (file.exists(path.join(cwd, ".mdtrc"))) {
        return cwd;
    }
    else {
        // get parent directory
        cwd = path.join(cwd, "../");
        console.log(cwd);
        if (cwd === "/") {
            return;
        }
        return mdtrc.dir(cwd);
    }
};

mdtrc.path = (function(){
    var dir = mdtrc._dir();
    if (dir) {
        return path.join(dir, "./.mdtrc");
    }

    return;
})();

mdtrc.dir = (function (){
    if (mdtrc.path) {
        return path.dirname(mdtrc.path);
    }
    else {
        return "";
    }
})();
