module.exports = <%= templateFunctionSource %>;

module.exports.toElement = function (locals) {
    var html = module.exports(locals);
    var containerEl = document.createElement("div");
    containerEl.innerHTML = html;
    if (containerEl.children.length !== 1) {
        throw new Error("toElement can only be called on Jade templates that contain a single element");
    }
    return containerEl.children[0];
};
