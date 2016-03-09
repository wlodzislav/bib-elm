function Elm(/* [el,] options */) {
	var el, options, existing
	if (arguments.length == 1) {
		options = arguments[0];
		el = document.createElement(options.tag || "div");
		existing = false;
	} else {
		options = arguments[1];
		el = arguments[0];
		existing = true;
	}

	for (var attribute in options) {
		if (attribute === 'children') {
			if (!options.children) {
				while (el.children.length) {
					el.removeChild(el.children[0]);
				}
				continue;
			}

			for (var i = 0, j = 0, len = options.children.length; i < len; i++) {
				var child = options.children[i];

				if (!child) {
					continue;
				}

				if (existing && el.children[j]) {
					if (child.nodeType > 0) {
						if (child != el.children[j]) {
							el.replaceChild(child, el.children[j]);
						}
						j++;
					} else if (child.el && child.el.nodeType > 0) {
						if (child.el != el.children[j]) {
							el.replaceChild(child.el, el.children[j]);
						}
						j++;
					} else if (Array.isArray(child)) {
						for (var p = 0, len2 = child.length; p < len2; p++) {
							var c = child[p];
							if (el.children[j]) {
								if (el.children[j].tagName.toLowerCase() == (c.tag || "div")) {
									Elm(el.children[j], c);
								} else {
									el.replaceChild(Elm(c), el.children[j]);
								}
							} else {
								el.appendChild(Elm(c));
							}
							j++;
						}
					} else {
						if (el.children[j].tagName.toLowerCase() == (child.tag || "div")) {
							Elm(el.children[j], child);
						} else {
							el.replaceChild(Elm(child), el.children[j]);
						}
						j++;
					}

				} else {
					if (child.nodeType > 0) {
						el.appendChild(child);
						j++;
					} else if (child.el && child.el.nodeType > 0) {
						el.appendChild(child.el);
						j++;
					} else if (Array.isArray(child)) {
						for (var p = 0, len2 = child.length; p < len2; p++) {
							var c = child[p];
							el.appendChild(Elm(c));
							j++;
						}
					} else {
						el.appendChild(Elm(child));
						j++;
					}
				}
			}

			if (existing && j < el.children.length) {
				for (var i = 0, len = el.children.length - j; i < len; i++) {
					el.removeChild(el.children[j]);
				}
			}

		} else if (attribute === 'attributes') {
			for (var attribute in options.attributes) {
				el.setAttribute(attribute, options.attributes[attribute]);
			}

		} else if (attribute === 'style' && typeof options.style !== "string") {
			for (var property in options.style) {
				el.style[property] = options.style[property];
			}

		} else {
			if (attribute !== 'tag') {
				var value = options[attribute];
				if (attribute in el) {
					if (!el.__elm_properties) {
						el.__elm_properties = [];
					}
					el.__elm_properties.push(attribute);
					el[attribute] = value;
				} else {
					el.setAttribute(attribute, value);
				}
			}
		}

		for (var k = 0, len = el.attributes.length; k < len; k++) {
			var attr = el.attributes[k].name;
			if (!options[attr]) {
				el.removeAttribute(attr);
			}
		}

		if (el.__elm_properties && el.__elm_properties.length != 0) {
			for (var k = 0; k < el.__elm_properties.length; k++) {
				var attr = el.__elm_properties[k];
				if (!options[attr]) {
					el[attr] = null;
					el.__elm_properties.splice(k, 1);
					k--;
				}
			}
		}
	}

	return el
}

if (typeof module == 'object' && module.exports) {
	module.exports = Elm;
} else {
	window.Elm = Elm;
}
