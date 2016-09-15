import through2 from 'through2';
import path from 'path';
import ejs from 'ejs';

export default function compile(opts) {
  const compileOpts = {
    client: true,
    cache: false,
    ...opts
  };

  function resolveTemplateName(file) {
    return path.relative(opts.basedir || file.cwd, file.path)
      .slice(0, -file.extname.length);
  }

  return through2.obj((file, encoding, cb) => {
    if (file.isNull() || file.isDirectory()) {
      cb(null, file);
      return;
    }

    if (file.isStream()) {
      return cb(new Error('Streaming is not supported!'));
    }

    let templateFn = ejs.compile(file.contents.toString(), compileOpts);
    let templateName = resolveTemplateName(file);

    try {
      ejs.renderFile(path.join(__dirname, 'tpl.ejs'), {
        templateName: templateName,
        templateBody: templateFn.toString()
      }, function(err, str) {
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
