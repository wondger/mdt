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

    var argv = argv.slice().slice(2),
        sargv = argv.join(" "),
        reg = /(?:^|\s+)(?:-f|--force)(?:\s+|$)/i;

    var force = reg.test(sargv);
    var src = sargv.replace(reg, "");


    switch (src) {
        case "":
            mdt.convertAll(force);
            break;
        default:
            /*
             * command: mdt xxx.md
             */
            console.log(src);
            mdt.convert(src, force);
            break;
    }
};

if (!module.parent) {
    main(process.argv);
}
else {
    module.exports = main;
}
