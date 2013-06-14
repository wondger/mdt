/*
 * @name: meta.js
 * @description: parse head meta
 * @author: wondger@gmail.com
 * @date: 2013-02-21
 * @param: 
 * @todo: 
 * @changelog: 
 */
"use strict";

var meta = module.exports = {};

var metaRe = /^(?:<!--[\r\n])([\s\S]+?)(?:[\r\n]-->[\r\n])/g;

var metakeyRe = /(?:^|[\r\n])@[a-z][a-z0-9_]*:\s/i;

meta.parse = function(src) {
    var ret = {},
        key = "";

    if (!src) {
        return "";
    }

    src = src.match(metaRe);

    src = src[0].replace(/^<!--[\r\n]+/, "").replace(/[\r\n]+-->[\r\n]*$/m, "");

    src = src.split(/[\r\n]/);

    src.forEach(function(item, index) {
        var kv = item.match(/^@([a-z][a-z0-9]*)\s*:\s([\s\S]*)/i);

        if (kv === null && key) {
            ret[key] = item;
            return;
        }

        key = kv[1];
        ret[key] = (ret[key] || "") + (kv[2] || "");
    });

    return ret;
};
