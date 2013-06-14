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
    log = require("../lib/mdt/log");

function isString(s) {
    return Object.prototype.toString.call(s) === '[object String]';
}

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
        else if (isString(file)) {
            mdt.convert(file, program.force);
        }
    });

program
    .command("push")
    .description("push files to server.")
    .action(function(file){
        if (isString(file)) {
            mdt.push(file);
        }
        else {
            log.errorln("✗ file not pass.")
        }
    });

program.parse(process.argv);
