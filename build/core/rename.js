'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

exports.default = rename;

var _stream = require('stream');

var _stream2 = _interopRequireDefault(_stream);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function rename(obj) {

  var stream = new _stream2.default.Transform({ objectMode: true });

  function parsePath(path) {
    var extname = _path2.default.extname(path);
    return {
      dirname: _path2.default.dirname(path),
      basename: _path2.default.basename(path, extname),
      extname: extname
    };
  }

  stream._transform = function (originalFile, unused, callback) {
    var file = originalFile.clone({ contents: false });
    var parsedPath = parsePath(file.relative);
    var path = void 0;

    var type = typeof obj === 'undefined' ? 'undefined' : _typeof(obj);

    if (type === 'string' && obj !== '') {
      path = obj;
    } else if (type === 'function') {
      obj(parsedPath);
      path = _path2.default.join(parsedPath.dirname, parsedPath.basename + parsedPath.extname);
    } else if (type === 'object' && obj !== void 0 && obj !== null) {
      var dirname = 'dirname' in obj ? obj.dirname : parsedPath.dirname;
      var prefix = obj.prefix || '';
      var suffix = obj.suffix || '';
      var basename = 'basename' in obj ? obj.basename : parsedPath.basename;
      var extname = 'extname' in obj ? obj.extname : parsedPath.extname;
      path = _path2.default.join(dirname, prefix + basename + suffix + extname);
    } else {
      callback(new Error('Unsupported renaming parameter type supplied'), void 0);
      return;
    }

    file.path = _path2.default.join(file.base, path);

    // Rename sourcemap if present
    if (file.sourceMap) {
      file.sourceMap.file = file.relative;
    }

    callback(null, file);
  };

  return stream;
}
module.exports = exports['default'];