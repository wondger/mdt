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
var Ftp = require("jsftp"),
    scp = require("scp");

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
    log.writeln("===Convert start===");

    if (!/\.md$/i.test(md)) {
        log.error("md file error");
        return;
    }

    var src = file.read(file.resolve(md, process.cwd()));

    var metaData = src ? meta.parse(src) : "";
    var TEMPLATE = "{{{CONTENT}}}";

    if (!metaData) {
        log.error("md file parse!");
        return;
    }

    var dest = metaData.dest ? file.resolve(metaData.dest, process.cwd()) : "",
        template = metaData.template ? file.resolve(metaData.template, process.cwd()) : "";

    if (!dest) {
        log.error("dest not define...");
    }
    else if (file.exists(dest) && !force) {
        log.error("file existsed!");
        return;
    }

    if (template) {
        TEMPLATE = file.read(template);
    }

    var content = marked(src);

    var data = metaData;
    data.CONTENT = content;

    if (!dest) {
        log.writeln(mustache.render(TEMPLATE, data));
    }
    else {
        file.write(dest, mustache.render(TEMPLATE, data));
    }

    log.writeln("===Convert finish!");
};

mdt.convertAll = function(force) {

    log.writeln("scan all markdown files...");
    walker(process.cwd())
        .on("file", function(file, stat) {
            if (/\.md$/i.test(file)) {
                mdt.convert(file, force);
            }
        })
        .on("end", function() {
            log.writeln("scan finished!");
        });
};

// create index page
mdt.index = function(md) {
};

// push
mdt._ftp = null;
mdt.push = function() {
    if (!mdt._ftp) {
        mdt._ftp = new Ftp({
            host: "106.187.97.235",
            user: "wondger",
            port: 21, // default port
            pass: "kten198651"
        });
    }

    mdt._ftp.put("/sites/omiga.org/mdt/test.md", file.read("test.md"), function(err, d) {
        console.log("error: " + err);
        console.log("d: " + d);
    });

    /*
     *scp.send({
     *    file: "test.md",
     *    user: "wondger",
     *    host: "106.187.97.235",
     *    port: "22",
     *    path: "/var/htdocs/sites/omiga.org/mdt/test.md"
     *}, function (err) {
     *    if (err) console.log(err);
     *    else log.ok('File transferred.');
     *});
     */
}

//mdt.post(path.join(__dirname, '../test/test.md'));
