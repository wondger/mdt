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
    .usage("command [options] <markdown file>.")
    .option("-a, --all", "mdt command to all markdown files.")
    .option("-f, --force", "mdt command to all markdown files force.");

program
    .command("build")
    .description("build html files via md files.")
    .action(function(file){
        if (program.all) {
            mdt.convertAll(program.force);
        }

        if (file) {
            mdt.convert(file, program.force);
        }
    });

program
    .command("push")
    .description("push files to server.")
    .action(function(file){
        mdt.push();
    });

program.parse(process.argv);
