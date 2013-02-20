/*
 * @name: file.js
 * @description: 
 * @author: wondger@gmail.com
 * @date: 2013-02-20
 * @param: 
 * @todo: 
 * @changelog: 
 */
"use strict";

var fs = require("fs");
var path = require("path");
var iconv = require('iconv-lite');
var log = require("./log");

var file = module.exports = {};

// Read a file, return its contents.
file.read = function(filepath, options) {
    if (!options) {
        options = {};
    }

    var contents;
    log.write('Reading ' + filepath + '...');
    try {
        contents = fs.readFileSync(String(filepath));
        // If encoding is not explicitly null, convert from encoded buffer to a
        // string. If no encoding was specified, use the default.
        if (options.encoding !== null) {
            contents = iconv.decode(contents, options.encoding || file.defaultEncoding);
            // Strip any BOM that might exist.
            if (contents.charCodeAt(0) === 0xFEFF) {
                contents = contents.substring(1);
            }
        }
        log.ok();
        return contents;
    } catch(e) {
        log.error();
        //throw grunt.util.error('Unable to read "' + filepath + '" file (Error code: ' + e.code + ').', e);
    }
};

file.readJSON = function(filepath, options) {
    var src = file.read(filepath, options);
    var ret;

    log.write('Parsing ' + filepath + '...');

    try {
        ret = JSON.parse(src);
        log.ok();
        return ret;

    } catch(e) {
        log.error();
        //throw grunt.util.error('Unable to parse "' + filepath + '" file (' + e.message + ').', e);
    }
};
