"use strict";

var path = require("path");
var browserify = require("browserify");
var deoptimize = require("browserify-deoptimizer");
var urlize = require("./utils").urlize;

module.exports = function (grunt, config) {
    // This is the array of URLs for the files we write out, to be returned to the caller.
    var newFileUrls = [];

    function asInDest(relativePath) {
        // Takes a relative paths and makes it a relative path, but inside config.dest.
        return path.relative(process.cwd(), path.resolve(config.dest, relativePath));
    }

    function writeFile(description, filePath, contents) {
        var destFilePath = asInDest(filePath);
        var destFileUrl = urlize(destFilePath);

        grunt.file.write(destFilePath, contents);
        grunt.log.writeln("Browserify " + description + " created at \"" + destFilePath + "\"");

        newFileUrls.push(destFileUrl);
    }

    var bundle = browserify({ cache: true });
    Object.keys(config.aliases || {}).forEach(function (alias) {
        bundle.alias(alias, config.aliases[alias]);
    });
    (config.middleware || []).forEach(bundle.use.bind(bundle));
    bundle.addEntry(config.entry);

    var deoptimized = deoptimize(bundle);
    Object.keys(deoptimized).forEach(function (fileName) {
        writeFile("module", fileName, deoptimized[fileName]);
    });
    return newFileUrls;
};
