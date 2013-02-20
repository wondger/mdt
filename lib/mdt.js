/*
 * @name: mdt.js
 * @description: a markdown tool
 * @author: wondger@gmail.com
 * @date: 2013-02-20
 * @param: 
 * @todo: 
 * @changelog: 
 */
"use strict";

var path = require("path");

// marked
var marked = require("marked");

// file
var file = require("./mdt/file");
var log = require("./mdt/log");

var mdt = module.exports = {};

// read mdtrc
mdt.rc = file.readJSON(path.join(__dirname, '../.mdtrc'));

mdt.post = function(md, html) {
    var src = file.read(md);

    log.writeln("Convert markdown file...");

    log.writeln(marked(src));
};

mdt.post(path.join(__dirname, '../test/test.md'));
