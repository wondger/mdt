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
    program = require("commander"),
    log = require("../lib/mdt/log"),
    pkg = require("../package");

function isString(s) {
    return Object.prototype.toString.call(s) === '[object String]';
}

program
    .version(pkg.version)
    .usage("command [options] <markdown file>.")
    .option("-a, --all", "command to all markdown files.")
    .option("-f, --force", "command to all markdown files force.");

program
    .command("build")
    .description("build html files via md files.")
    .action(function(file){
        if (program.all) {
            mdt.convertAll(program.force);
        }
        else if (arguments.length > 1) {
            var i = 0;
            while(i < arguments.length - 1) {
                mdt.convert(arguments[i++], program.force);
            }
        }
        else {
            log.errorln("✗ md file not pass.")
        }
    });

program
    .command("push")
    .description("push files to server.")
    .action(function(file){
        if (program.all) {
            mdt.pushAll();
        }
        else if (arguments.length > 1) {
            var i = 0;
            while(i < arguments.length - 1) {
                mdt.push(arguments[i++]);
            }
        }
        else {
            log.errorln("✗ file not pass.")
        }
    });

program.parse(process.argv);
