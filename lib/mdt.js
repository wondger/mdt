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
    if (!/\.md$/i.test(md)) {
        log.errorln("✗ " + md + " is not a markdown file.");
        return;
    }

    var logmsg = log.color.info(md);

    logmsg += log.color.ok(" → read");

    var src = file.read(file.resolve(md, process.cwd()));

    var metaData = src ? meta.parse(src) : "";
    var TEMPLATE = "{{{CONTENT}}}";

    if (!metaData) {
        logmsg += log.color.error("→ parse error");
        log.writeln(log.color.error("✗") + " " + logmsg);
        return;
    }

    logmsg += log.color.ok(" → parse");

    var dest = metaData.dest ? file.resolve(metaData.dest, process.cwd()) : "",
        template = metaData.template ? file.resolve(metaData.template, process.cwd()) : "";

    if (!dest) {
        logmsg += log.color.error(" → dest not define.");
        log.writeln(log.color.error("✗") + " " + logmsg);
        return;
    }
    else if (file.exists(dest) && !force) {
        logmsg += log.color.error(" → file exists.");
        log.writeln(log.color.error("✗") + " " + logmsg);
        return;
    }

    if (template) {
        TEMPLATE = file.read(template);
    }

    var content = marked(src);

    var data = metaData;
    data.CONTENT = content;

    logmsg += log.color.ok(" → write" + path.relative(md, dest));
    file.write(dest, mustache.render(TEMPLATE, data));

    log.writeln(log.color.ok("✓") + " " + logmsg);
};

mdt.convertAll = function(force) {

    var cwd;

    walker(cwd = process.cwd())
        .on("file", function(file, stat) {
            file = path.relative(cwd, file);
            if (/\.md$/i.test(file)) {
                mdt.convert(file, force);
            }
        })
        .on("end", function() {
        });
};

// create index page
mdt.index = function(md) {
};

// push
mdt._ftp = null;
mdt.push = function(localfile) {
    if (!mdt._ftp) {
        mdt._ftp = new Ftp({
            host: "106.187.97.235",
            user: "wondger",
            port: 21, // default port
            pass: "kten198651"
        });
    }

    mdt._ftp.put("/sites/omiga.org/mdt/" + localfile, file.read(file.resolve(localfile, process.cwd())), function(err, d) {
        if (err) {
            log.errorln("✗ " + localfile + " push fail.");
        }
        else {
            log.okln("✓ " + localfile + " push success.");
        }
        process.exit();
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
     *    process.exit();
     *});
     */
}

//mdt.post(path.join(__dirname, '../test/test.md'));
