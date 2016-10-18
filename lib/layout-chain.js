'use strict';
var contentPattern = '&&<>&&';

function contentFor(contentName) {
  return contentPattern + contentName + contentPattern;
}

function parseContents(locals) {
  var name, i = 1, str = locals.body,
    regex = new RegExp('\n?' + contentPattern + '.+?' + contentPattern + '\n?', 'g'),
    split = str.split(regex),
    matches = str.match(regex);

  locals.body = split[0];

  if (matches !== null) {
    matches.forEach(function (match) {
      name = match.split(contentPattern)[1];
      locals[name] = split[i];
      i++;
    });
  }
}

/*
*  res.render('news/news', {title: 'Breaking News!', content: 'Trump wins', layout: 'layout>categories'}, fn);
*/
module.exports = function (req, res, next) {
  var render = res.render;

  res.render = function (view, options, fn) {
    var layout, self = this, app = req.app,
      defaultLayout = app.get('layout');

    options = options || {};
    if (typeof options === 'function') {
      fn = options;
      options = {};
    }
    options = Object.create(options);
    options.defineContent = function (contentName) { return options[contentName] || ''; };

    if (options.layout === false || ((options.layout || defaultLayout) === false)) {
      render.call(res, view, options, fn);
      return;
    }

    layout = options.layout || res.locals.layout || defaultLayout;
    if (layout === true || layout === undefined) {
      layout = 'layout';
    }

    layout = layout.trim();

    function renderWithLayout (view, layoutChain, options, done) {
      options.contentFor = contentFor;
      if(!layoutChain.length) {
        return render.call(self, view, options, done);
      }
      render.call(self, view, options, function (err, str) {
        if (err) {
          return done ? done(err): next(err);
        }
        options = Object.getPrototypeOf(options);
        options = Object.create(options);
        options.body = str;
        options.defineContent = function (contentName) { return options[contentName] || ''; };

        parseContents(options);

        view = layoutChain.pop();
        renderWithLayout(view, layoutChain, options, done);
      });
    }
    var layoutChain = layout.split('>').filter(function (i) {return i;});

    renderWithLayout(view, layoutChain, options, fn);
  };
  next();
};
