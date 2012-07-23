"use strict";

var fs = require("fs");
var path = require("path");
var jade = require("jade");
var _ = require("underscore");

var jadeModuleTemplate = fs.readFileSync(path.resolve(__dirname, "jadeModule.jstmpl")).toString();

exports[".jade"] = {
    includeScripts: [require.resolve("jade/runtime")],
    handler: function (body, file) {
        var templateFunction = jade.compile(body, { filename: file, compileDebug: false, client: true });
        return _.template(jadeModuleTemplate, { templateFunctionSource: templateFunction.toString() });
    }
};
