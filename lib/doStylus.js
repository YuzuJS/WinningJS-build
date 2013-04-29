"use strict";

var path = require("path");
var stylus = require("stylus");
var urlize = require("./utils").urlize;

module.exports = function (grunt, config) {
    var files = grunt.file.expand(config.src);

    var newFileUrls = [];
    files.forEach(function (fileName) {
        var fileContents = grunt.file.read(fileName);
        var newFileName = fileName.match(/(.*).styl/)[1] + ".css";
        var newFilePath = path.join(config.dest, newFileName);

        // NB: this isn't actually asynchronous; it just uses callbacks for some reason. That's what makes it possible
        // to push onto `newFileUrls`.
        stylus.render(fileContents, { filename: newFileName }, function (err, css) {
            if (err) {
                grunt.warn(err.message);
            } else {
                grunt.file.write(newFilePath, css);
                grunt.log.writeln("CSS file created at \"" + newFilePath + "\".");

                newFileUrls.push(urlize(newFilePath));
            }
        });
    });

    return newFileUrls;
};
