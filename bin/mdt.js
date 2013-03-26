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
var mdt = require("../lib/mdt"),
    program = require("commander");

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
            mdt.convert(src, force);
            break;
    }
};

/*
 *if (!module.parent) {
 *    main(process.argv);
 *}
 *else {
 *    module.exports = main;
 *}
 */

program
    .version("0.0.1")
    .usage("[options] <markdown file>")
    .option("-a, --all", "build all markdown files");

program
    .command("build")
    .description("build html files via md files.")
    .action(function(){
        console.log("build what...");
    });

program.parse(process.argv);

if (program.all) console.log("--all");
