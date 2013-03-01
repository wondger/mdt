#! /usr/bin/env node
/*
 * @name: mdt.js
 * @description: for CLI
 * @author: wondger@gmail.com
 * @date: 2013-02-22
 * @param: 
 * @todo: 
 * @changelog: 
 */
var mdt = require("../lib/mdt");
function main(argv) {
    if (!mdt) {
        return;
    }

    var argv = argv.slice().slice(2);

    var todo = argv.length ? argv.shift() : "";
    var src = argv.length ? argv[0] : "";

    switch (todo) {
        case "--convert":
        case "-c":
            if (!src) return;
            mdt.convert(src, true);
            break;
        case "":
        case "--all":
        case "-a":
            mdt.convertAll();
            break;
        default:
            /*
             * command: mdt xxx.md
             */
            if (/\.md$/i.test(todo) && !src) {
                mdt.post(todo);
            }
            break;
    }
};

if (!module.parent) {
    main(process.argv);
}
else {
    module.exports = main;
}
