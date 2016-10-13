# ejs-layout-chain

> Layout chain support for ejs in express 4.x

## Installation

```sh
$ npm install ejs-layout-chain
```

## Usage

```js
var express = require('express');
var ejsLayoutChain = require('ejs-layout-chain');

var app = express();

app.set('view engine', 'ejs');

app.use(ejsLayoutChain);

app.get('/', function(req, res) {
  var locals = {
    title: 'Page Title',
    description: 'Page Description',
    header: 'Page Header',
    layout: 'layout>category'
  };
  res.render('news', locals);
});

app.listen(3000);
```


### `contentFor`

For example, consider this view:

```html
foo
<%- contentFor('pageSectionA') %>
bar
<%- contentFor('pageSectionB') %>
baz
```

Using it with this layout:

```html
<div class="header"><%- pageSectionA %></div>
<div class="body"><%- body %></div>
<div class="footer"><%-defineContent('pageSectionB')%></div>
```

Will render:

```html
<div class="header">bar</div>
<div class="body">foo</div>
<div class="footer">baz</div>
```

Notice that the difference between using `<%- pageSectionA %>` and `<%-defineContent('pageSectionA')%>` is that the former will generate an error if the view doesn't define content for this section.


### Layout chain

If you want to specify the layout you want to render a view in, instead of specifying one layout, you can specify a layout chain like 'layout1>layout2', this will render view as body of layout2, then layout2 as body of layout1.


For example, consider this view:

```html
foo
<%- contentFor('pageSectionA') %>
bar
<%- contentFor('pageSectionB') %>
baz
```

Using it with layout1:

```html
<div class="layout1-header"><%- pageSectionA %></div>
<div class="layout1-body"><%- body %></div>
<div class="layout1-footer"><%-defineContent('pageSectionB')%></div>
```
layout2:
```html
<div class="layout2-header"><%- pageSectionA %></div>
<div class="layout2-body"><%- body %></div>
<div class="layout2-footer"><%-defineContent('pageSectionB')%></div>
<%- contentFor('pageSectionA') %>
<%- pageSectionA %>
<%- contentFor('pageSectionB') %>
<%-defineContent('pageSectionB')%>
```

as:

```js
  res.render('view', {layout: 'layout1>layout2'});
```

Will render:

```html

<div class="layout1-header">bar</div>
<div class="layout1-body">
  <div class="layout2-header">bar</div>
  <div class="layout2-body">foo</div>
  <div class="layout2-footer">baz</div>
</div>
<div class="layout1-footer">baz</div>

```

## Running tests

Clone the rep and run:

```sh
$ make test
```

## License

MIT
