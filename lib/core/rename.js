import Stream from 'stream';
import Path from 'path';

export default function rename(obj) {

  const stream = new Stream.Transform({objectMode: true});

  function parsePath(path) {
    let extname = Path.extname(path);
    return {
      dirname: Path.dirname(path),
      basename: Path.basename(path, extname),
      extname: extname
    };
  }

  stream._transform = function(originalFile, unused, callback) {
    let file = originalFile.clone({contents: false});
    let parsedPath = parsePath(file.relative);
    let path;

    let type = typeof obj;

    if (type === 'string' && obj !== '') {
      path = obj;
    } else if (type === 'function') {
      obj(parsedPath);
      path = Path.join(parsedPath.dirname, parsedPath.basename + parsedPath.extname);
    } else if (type === 'object' && obj !== void 0 && obj !== null) {
      let dirname = 'dirname' in obj ? obj.dirname : parsedPath.dirname;
      let prefix = obj.prefix || '';
      let suffix = obj.suffix || '';
      let basename = 'basename' in obj ? obj.basename : parsedPath.basename;
      let extname = 'extname' in obj ? obj.extname : parsedPath.extname;
      path = Path.join(dirname, prefix + basename + suffix + extname);
    } else {
      callback(new Error('Unsupported renaming parameter type supplied'), void 0);
      return;
    }

    file.path = Path.join(file.base, path);

    // Rename sourcemap if present
    if (file.sourceMap) {
      file.sourceMap.file = file.relative;
    }

    callback(null, file);
  };

  return stream;
}
