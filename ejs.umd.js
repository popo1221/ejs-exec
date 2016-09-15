(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports);
    global.ejs = mod.exports;
  }
})(this, function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var cache = {};

  function include(templateName, data) {
    return render(templateName, data);
  }

  function register(templateName, templateFn) {
    cache[templateName] = templateFn;
  }

  function render(templateName, data) {
    var templateFn = cache[templateName];
    if (!templateFn) {
      throw new Error("Cannot find the template \"" + templateName + "\"");
    }

    return templateFn(data, null, include);
  }

  global.ejs = { register: register, render: render };
  exports.default = { register: register, render: render };
});
