'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = compile;

var _through = require('through2');

var _through2 = _interopRequireDefault(_through);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _ejs = require('ejs');

var _ejs2 = _interopRequireDefault(_ejs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function compile(opts) {
  var compileOpts = _extends({
    client: true,
    cache: false
  }, opts);

  var basedir = _path2.default.resolve(opts.basedir);
  var templateFile = _path2.default.join(__dirname, '../../template/tpl.ejs');

  function resolveTemplateName(file) {
    return file.relative.slice(0, -file.extname.length);
  }

  return _through2.default.obj(function (file, encoding, cb) {
    if (file.isNull() || file.isDirectory()) {
      cb(null, file);
      return;
    }

    if (file.isStream()) {
      return cb(new Error('Streaming is not supported!'));
    }

    // Set new base
    file.base = basedir;

    var templateFn = _ejs2.default.compile(file.contents.toString(), compileOpts);
    var templateName = resolveTemplateName(file);

    try {
      _ejs2.default.renderFile(templateFile, {
        templateName: templateName,
        templateBody: templateFn.toString()
      }, function (err, str) {
        if (err) {
          return cb(err);
        }
        file.contents = new Buffer(str);
        cb(null, file);
      });
    } catch (err) {
      return cb(err);
    }
  });
}
module.exports = exports['default'];