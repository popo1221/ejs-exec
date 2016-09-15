const cache = {};

function include(templateName, data) {
  return render(templateName, data);
}

function register(templateName, templateFn) {
  cache[templateName] = templateFn;
}

function render(templateName, data) {
  let templateFn = cache[templateName];
  if (!templateFn) {
    throw new Error(`Cannot find the template "${templateName}"`);
  }

  return templateFn(data, null, include);
}

global.ejs = {register, render};
export default {register, render};
