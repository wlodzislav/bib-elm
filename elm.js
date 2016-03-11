function Elm(options, el) {
	var existing = true;
	if (el == null) {
		el = document.createElement(options.tag || "div");
		existing = false;
	}

	if (options.create) {
		return options.create(options.attrs, options.children);
	}

	if (options.children) {
		for (var i = 0, j = 0, len = options.children.length; i < len; i++) {
			var child = options.children[i];

			if (!child) {
				continue;
			}

			if (existing && el.childNodes[j]) {
				if (child.nodeType > 0) {
					if (child != el.childNodes[j]) {
						el.replaceChild(child, el.childNodes[j]);
					}
					j++;
				} else if (child.el && child.el.nodeType > 0) {
					if (child.el != el.childNodes[j]) {
						el.replaceChild(child.el, el.childNodes[j]);
					}
					j++;
				} else if (typeof(child) == "string") {
					var c = document.createTextNode(child);
					el.replaceChild(c, el.childNodes[j]);
					j++;
				} else if (Array.isArray(child)) {
					for (var p = 0, len2 = child.length; p < len2; p++) {
						var c = child[p];
						if (el.childNodes[j]) {
							if (el.childNodes[j].tagName.toLowerCase() == (c.tag || "div")) {
								Elm(c, el.childNodes[j]);
							} else {
								el.replaceChild(Elm(c), el.childNodes[j]);
							}
						} else {
							el.appendChild(Elm(c));
						}
						j++;
					}
				} else {
					if (el.childNodes[j].tagName && el.childNodes[j].tagName.toLowerCase() == (child.tag || "div")) {
						Elm(child, el.childNodes[j]);
					} else {
						el.replaceChild(Elm(child), el.childNodes[j]);
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
				} else if (typeof(child) == "string") {
					var c = document.createTextNode(child);
					el.appendChild(c, el.childNodes[j]);
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

		if (existing && j < el.childNodes.length) {
			for (var i = 0, len = el.childNodes.length - j; i < len; i++) {
				el.removeChild(el.childNodes[j]);
			}
		}
	} else {
		if (existing && !options.children) {
			while (el.childNodes.length) {
				el.removeChild(el.childNodes[0]);
			}
		}
	}

	var attrs = (options.attrs || options);
	for (var attribute in attrs) {
		if (attribute == 'style' && typeof attrs.style != "string") {
			for (var property in attrs.style) {
				el.style[property] = attrs.style[property];
			}

		} else {
			if (attribute != 'tag') {
				var value = attrs[attribute];
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
			if (!attrs[attr]) {
				el.removeAttribute(attr);
			}
		}

		if (el.__elm_properties && el.__elm_properties.length != 0) {
			for (var k = 0; k < el.__elm_properties.length; k++) {
				var attr = el.__elm_properties[k];
				if (!attrs[attr]) {
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
