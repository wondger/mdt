/*
 * @name: file.js
 * @description: see grunt scripts
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

var pathSeparatorRe = /[\/\\]/g;

var file = module.exports = {};

file.defaultEncoding = 'utf8';

// True if the file path exists.
file.exists = function() {
  var filepath = path.join.apply(path, arguments);
  return fs.existsSync(filepath);
};

// Like mkdir -p. Create a directory and any intermediary directories.
file.mkdir = function(dirpath, mode) {
    // Set directory mode in a strict-mode-friendly way.
    if (mode == null) {
        mode = parseInt('0777', 8) & (~process.umask());
    }
    dirpath.split(pathSeparatorRe).reduce(function(parts, part) {
        parts += part + '/';
        var subpath = path.resolve(parts);
        if (!file.exists(subpath)) {
            try {
                fs.mkdirSync(subpath, mode);
            } catch(e) {
                log.error();
                //throw grunt.util.error('Unable to create directory "' + subpath + '" (Error code: ' + e.code + ').', e);
            }
        }
        return parts;
    }, '');
};

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

// Write a file.
file.write = function(filepath, contents, options) {
    if (!options) {
        options = {};
    }

    log.write('Writing ' + filepath + '...');
    // Create path, if necessary.
    file.mkdir(path.dirname(filepath));
    try {
        // If contents is already a Buffer, don't try to encode it. If no encoding
        // was specified, use the default.
        if (!Buffer.isBuffer(contents)) {
            contents = iconv.encode(contents, options.encoding || file.defaultEncoding);
        }
        // Actually write file.
        fs.writeFileSync(filepath, contents);
        log.ok();
        return true;
    } catch(e) {
        log.error();
        //throw grunt.util.error('Unable to write "' + filepath + '" file (Error code: ' + e.code + ').', e);
    }
};

file.resolve = function(p, from) {
    if (/^\//.test(p)) {
        return p;
    }

    from = from || "";

    return path.join(from, "./" + p);
};
