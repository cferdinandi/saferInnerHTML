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
		atts.forEach(function (attribute) {
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
		});
	};

	/**
	 * Create an array of the attributes on an element
	 * @param  {NamedNodeMap} attributes The attributes on an element
	 * @return {Array}                   The attributes on an element as an array of key/value pairs
	 */
	var getAttributes = function (attributes) {
		return Array.from(attributes).map(function (attribute) {
			return {
				att: attribute.name,
				value: attribute.value
			};
		});
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
			elem.children.forEach(function (childElem) {
				node.appendChild(makeElem(childElem));
			});
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
		map.forEach(function (node, index) {
			app.appendChild(makeElem(node));
		});
	};

	/**
	 * Create a DOM Tree Map for an element
	 * @param  {Node}   element The element to map
	 * @return {Array}          A DOM tree map
	 */
	var createDOMMap = function (element) {
		var map = [];
		Array.from(element.childNodes).forEach(function (node) {
			map.push({
				content: node.childNodes && node.childNodes.length > 0 ? null : node.textContent,
				atts: node.nodeType === 3 ? [] : getAttributes(node.attributes),
				type: node.nodeType === 3 ? 'text' : node.tagName.toLowerCase(),
				children: createDOMMap(node)
			});
		});
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
