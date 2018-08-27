/*!
 * saferInnerHTML v1.1.2: A vanilla JS helper function for safely injecting HTML into the DOM
 * (c) 2018 Chris Ferdinandi
 * MIT License
 * http://github.com/cferdinandi/reef
 */

/**
 * Array.from() polyfill
 */
// From https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/from
// Production steps of ECMA-262, Edition 6, 22.1.2.1
if (!Array.from) {
	Array.from = (function () {
		var toStr = Object.prototype.toString;
		var isCallable = function (fn) {
			return typeof fn === 'function' || toStr.call(fn) === '[object Function]';
		};
		var toInteger = function (value) {
			var number = Number(value);
			if (isNaN(number)) { return 0; }
			if (number === 0 || !isFinite(number)) { return number; }
			return (number > 0 ? 1 : -1) * Math.floor(Math.abs(number));
		};
		var maxSafeInteger = Math.pow(2, 53) - 1;
		var toLength = function (value) {
			var len = toInteger(value);
			return Math.min(Math.max(len, 0), maxSafeInteger);
		};

		// The length property of the from method is 1.
		return function from(arrayLike/*, mapFn, thisArg */) {
			// 1. Let C be the this value.
			var C = this;

			// 2. Let items be ToObject(arrayLike).
			var items = Object(arrayLike);

			// 3. ReturnIfAbrupt(items).
			if (arrayLike === null) {
				throw new TypeError('Array.from requires an array-like object - not null or undefined');
			}

			// 4. If mapfn is undefined, then let mapping be false.
			var mapFn = arguments.length > 1 ? arguments[1] : void undefined;
			var T;
			if (typeof mapFn !== 'undefined') {
				// 5. else
				// 5. a If IsCallable(mapfn) is false, throw a TypeError exception.
				if (!isCallable(mapFn)) {
					throw new TypeError('Array.from: when provided, the second argument must be a function');
				}

				// 5. b. If thisArg was supplied, let T be thisArg; else let T be undefined.
				if (arguments.length > 2) {
					T = arguments[2];
				}
			}

			// 10. Let lenValue be Get(items, "length").
			// 11. Let len be ToLength(lenValue).
			var len = toLength(items.length);

			// 13. If IsConstructor(C) is true, then
			// 13. a. Let A be the result of calling the [[Construct]] internal method
			// of C with an argument list containing the single item len.
			// 14. a. Else, Let A be ArrayCreate(len).
			var A = isCallable(C) ? Object(new C(len)) : new Array(len);

			// 16. Let k be 0.
			var k = 0;
			// 17. Repeat, while k < len… (also steps a - h)
			var kValue;
			while (k < len) {
				kValue = items[k];
				if (mapFn) {
					A[k] = typeof T === 'undefined' ? mapFn(kValue, k) : mapFn.call(T, kValue, k);
				} else {
					A[k] = kValue;
				}
				k += 1;
			}
			// 18. Let putStatus be Put(A, "length", len, true).
			A.length = len;
			// 20. Return A.
			return A;
		};
	}());
}
var saferInnerHTML = function (app, template, append) {

	'use strict';


	//
	// Variables
	//

	var parser = null;


	//
	// Methods
	//

	var supports = function () {
		if (!Array.from || !window.DOMParser) return false;
		parser = parser || new DOMParser();
		try {
			parser.parseFromString('x', 'text/html');
		} catch(err) {
			return false;
		}
		return true;
	};

	/**
	 * Add attributes to an element
	 * @param {Node}  elem The element
	 * @param {Array} atts The attributes to add
	 */
	var addAttributes = function (elem, atts) {
		atts.forEach((function (attribute) {
			// If the attribute is a class, use className
			// Else if it starts with `data-`, use setAttribute()
			// Otherwise, set is as a property of the element
			if (attribute.att === 'class') {
				elem.className = attribute.value;
			} else if (attribute.att.slice(0, 5) === 'data-') {
				elem.setAttribute(attribute.att, attribute.value || '');
			} else {
				elem[attribute.att] = attribute.value || '';
			}
		}));
	};

	/**
	 * Create an array of the attributes on an element
	 * @param  {NamedNodeMap} attributes The attributes on an element
	 * @return {Array}                   The attributes on an element as an array of key/value pairs
	 */
	var getAttributes = function (attributes) {
		return Array.from(attributes).map((function (attribute) {
			return {
				att: attribute.name,
				value: attribute.value
			};
		}));
	};

	/**
	 * Make an HTML element
	 * @param  {Object} elem The element details
	 * @return {Node}        The HTML element
	 */
	var makeElem = function (elem) {

		// Create the element
		var node = elem.type === 'text' ? document.createTextNode(elem.content) : document.createElement(elem.type);

		// Add attributes
		addAttributes(node, elem.atts);

		// If the element has child nodes, create them
		// Otherwise, add textContent
		if (elem.children.length > 0) {
			elem.children.forEach((function (childElem) {
				node.appendChild(makeElem(childElem));
			}));
		} else if (elem.type !== 'text') {
			node.textContent = elem.content;
		}

		return node;

	};

	/**
	 * Render the template items to the DOM
	 * @param  {Array} map A map of the items to inject into the DOM
	 */
	var renderToDOM = function (map) {
		if (!append) { app.innerHTML = ''; }
		map.forEach((function (node, index) {
			app.appendChild(makeElem(node));
		}));
	};

	/**
	 * Create a DOM Tree Map for an element
	 * @param  {Node}   element The element to map
	 * @return {Array}          A DOM tree map
	 */
	var createDOMMap = function (element) {
		var map = [];
		Array.from(element.childNodes).forEach((function (node) {
			map.push({
				content: node.childNodes && node.childNodes.length > 0 ? null : node.textContent,
				atts: node.nodeType === 3 ? [] : getAttributes(node.attributes),
				type: node.nodeType === 3 ? 'text' : node.tagName.toLowerCase(),
				children: createDOMMap(node)
			});
		}));
		return map;
	};

	/**
	 * Convert a template string into HTML DOM nodes
	 * @param  {String} str The template string
	 * @return {Node}       The template HTML
	 */
	var stringToHTML = function (str) {
		parser = parser || new DOMParser();
		var doc = parser.parseFromString(str, 'text/html');
		return doc.body;
	};


	//
	// Inits
	//

	// Don't run if there's no element to inject into
	if (!app) throw new Error('safeInnerHTML: Please provide a valid element to inject content into');

	// Check for browser support
	if (!supports()) throw new Error('safeInnerHTML: Your browser is not supported.');

	// Render the template into the DOM
	renderToDOM(createDOMMap(stringToHTML(template)));

};
