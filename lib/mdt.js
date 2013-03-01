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
marked.setOptions({
    gfm: true,
    tables: true,
    breaks: false,
    pedantic: false,
    sanitize: false,
    smartLists: true,
    langPrefix: 'lang-',
    highlight: function(code, lang) {
        if (lang === 'js') {
            return highlighter.javascript(code);
        }

        return code;
    }
});

var mustache = require("mustache");
var walker = require("walker");

// file
var file = require("./mdt/file");
var log = require("./mdt/log");
var meta = require("./mdt/meta");
//var mdtrc = require("./mdt/mdtrc");

//log.writeln(mdtrc.path || "get mdtrc error");

var mdt = module.exports = {};

//mdt.rc = file.readJSON(mdtrc.path);

mdt.convert = function(md, force) {
    if (!/\.md$/i.test(md)) {
        log.error("md file error");
        return;
    }

    var src = file.read(file.resolve(md, process.cwd()));

    var metaData = meta.parse(src);
    var TEMPLATE = "{{{CONTENT}}}";

    if (!metaData) {
        return;
    }

    var dest = metaData.dest ? file.resolve(metaData.dest, process.cwd()) : "",
        template = metaData.template ? file.resolve(metaData.template, process.cwd()) : "";

    if (!dest) {
        log.error("dest not define...");
    }
    else if (file.exists(dest) && !force) {
        log.ok(dest);
        log.error("file existsed!");
        return;
    }

    if (template) {
        TEMPLATE = file.read(template);
    }

    log.writeln("Convert markdown file...");

    var content = marked(src);

    var data = metaData;
    data.CONTENT = content;

    if (!dest) {
        log.writeln(mustache.render(TEMPLATE, data));
    }
    else {
        file.write(dest, mustache.render(TEMPLATE, data));
    }
};

mdt.convertAll = function() {

    walker(path.join(mdtrc.dir, mdt.rc.src))
        .on("file", function(file, stat) {
            console.log(stat);
        });
};

//mdt.post(path.join(__dirname, '../test/test.md'));
