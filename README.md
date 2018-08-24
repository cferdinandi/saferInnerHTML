# saferInnerHTML [![Build Status](https://travis-ci.org/cferdinandi/saferInnerHTML.svg)](https://travis-ci.org/cferdinandi/saferInnerHTML)
Set the HTML of an element with the simplicity of `innerHTML`, while protecting yourself from XSS attacks.

<hr>

### Want to learn how to write your own vanilla JS plugins? Check out my [Vanilla JS Pocket Guides](https://vanillajsguides.com/) or join the [Vanilla JS Academy](https://vanillajsacademy.com) and level-up as a web developer. 🚀

<hr>

## Getting Started

Compiled and production-ready code can be found in the `dist` directory. The `src` directory contains development code.

### 1. Include saferInnerHTML on your site.

There are two versions of saferInnerHTML: the standalone version, and one that comes preloaded with a polyfill for `Array.from()`, which is only supported in newer browsers.

If you're including your own polyfills or don't want to support older browsers (you monster!), use the standalone version. Otherwise, use the version with polyfills.

**Direct Download**

You can [download the files directly from GitHub](https://github.com/cferdinandi/saferInnerHTML/archive/master.zip).

```html
<script src="path/to/saferInnerHTML.polyfills.min.js"></script>
```

**CDN**

You can also use the [jsDelivr CDN](https://www.jsdelivr.com/package/gh/cferdinandi/saferInnerHTML?path=dist). I recommend linking to a specific version number or version range to prevent major updates from breaking your site. Reef uses semantic versioning.

```html
<!-- Always get the latest version -->
<!-- Not recommended for production sites! -->
<script src="https://cdn.jsdelivr.net/gh/cferdinandi/reef/dist/saferInnerHTML.polyfills.min.js"></script>

<!-- Get minor updates and patch fixes within a major version -->
<script src="https://cdn.jsdelivr.net/gh/cferdinandi/reef@1/dist/saferInnerHTML.polyfills.min.js"></script>

<!-- Get patch fixes within a minor version -->
<script src="https://cdn.jsdelivr.net/gh/cferdinandi/reef@1.0/dist/saferInnerHTML.polyfills.min.js"></script>

<!-- Get a specific version -->
<script src="https://cdn.jsdelivr.net/gh/cferdinandi/reef@1.0.0/dist/saferInnerHTML.polyfills.min.js"></script>
```

### 2. Inject any string into any element

The `saferInnerHTML()` method accepts three arguments.

```js
/**
 * @param {Node}    elem      The element to inject markup into
 * @param {String}  template  The string to inject into the element
 * @param {Boolean} append    [optional] If true, append string to existing content instead of replacing it
 */
saferInnerHTML(elem, template, append);
```

Here's an example. [Play with the demo.](https://codepen.io/cferdinandi/pen/PdPwga)

```html
<div id="app"></div>
```

```js
var app = document.querySelector('#app');
var template = '<p>Hello, world!</p><button>Click me</button>';
saferInnerHTML(app, template);
```

And here's another, this time appending the new string to the existing content. [There's a demo for that one, too.](https://codepen.io/cferdinandi/pen/RYWPbM)

```html
<div id="app">
    <p>Hi, universe!</p>
</div>
```

```js
var app = document.querySelector('#app');
var template = '<button>Do NOT click me</button>';
saferInnerHTML(app, template, true);
```

### 3. That's it!

You're done. Nice work. Go make something awesome!



## Browser Compatibility

Reef works in all modern browsers, and IE 10 and above.

### Polyfills

Support back to IE10 requires a polyfill for `Array.from()`. Without it, support starts with Edge.

Use the included polyfill version of saferInnerHTML, or include your own.



## License

The code is available under the [MIT License](LICENSE.md).