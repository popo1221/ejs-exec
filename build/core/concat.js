'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (outFileName, opts) {
  opts = opts || {};
  var _opts = opts;
  var _opts$generateSourceM = _opts.generateSourceMap;
  var generateSourceMap = _opts$generateSourceM === undefined ? true : _opts$generateSourceM;
  var _opts$separator = _opts.separator;
  var separator = _opts$separator === undefined ? '\n' : _opts$separator;

  var concat = null;
  var latestFile = null;
  var latestMod = null;

  return _through2.default.obj(function (file, encoding, cb) {
    if (file.isNull() || file.isDirectory()) {
      cb(null, file);
      return;
    }

    if (file.isStream()) {
      return cb(new Error('Streaming is not supported!'));
    }

    // set latest file if not already set,
    // or if the current file was modified more recently.
    if (!latestMod || file.stat && file.stat.mtime > latestMod) {
      latestFile = file;
      latestMod = file.stat && file.stat.mtime;
    }

    if (!concat) {
      concat = new _concatWithSourcemaps2.default(generateSourceMap, outFileName, separator);
    }

    concat.add(file.path, file.contents);
    cb();
  }, function (cb) {
    if (!latestFile || !concat) {
      return cb();
    }

    var joinedFile = void 0;

    // if file opt was a file path
    // clone everything from the latest file
    if (typeof outFileName === 'string') {
      joinedFile = latestFile.clone({ contents: false });
      joinedFile.path = _path2.default.join(latestFile.base, outFileName);
    } else {
      joinedFile = new _vinyl2.default(outFileName);
    }

    joinedFile.contents = concat.content;

    if (concat.sourceMapping) {
      joinedFile.sourceMap = JSON.parse(concat.sourceMap);
    }

    this.push(joinedFile);
    cb();
  });
};

var _concatWithSourcemaps = require('concat-with-sourcemaps');

var _concatWithSourcemaps2 = _interopRequireDefault(_concatWithSourcemaps);

var _through = require('through2');

var _through2 = _interopRequireDefault(_through);

var _vinyl = require('vinyl');

var _vinyl2 = _interopRequireDefault(_vinyl);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = exports['default'];