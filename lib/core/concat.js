import Concat from 'concat-with-sourcemaps';
import through2 from 'through2';
import File from 'vinyl';
import path from 'path';

export default function(outFileName, opts) {
  opts = opts || {};
  let {
    generateSourceMap = true,
    separator = '\n'
  } = opts;
  let concat = null;
  let latestFile = null;
  let latestMod = null;

  return through2.obj(function(file, encoding, cb) {
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
      concat = new Concat(generateSourceMap, outFileName, separator);
    }

    concat.add(file.path, file.contents);
    cb();
  }, function(cb) {
    if (!latestFile || !concat) {
      return cb();
    }

    let joinedFile;

    // if file opt was a file path
    // clone everything from the latest file
    if (typeof outFileName === 'string') {
      joinedFile = latestFile.clone({contents: false});
      joinedFile.path = path.join(latestFile.base, outFileName);
    } else {
      joinedFile = new File(outFileName);
    }

    joinedFile.contents = concat.content;

    if (concat.sourceMapping) {
      joinedFile.sourceMap = JSON.parse(concat.sourceMap);
    }

    this.push(joinedFile);
    cb();
  });
}
