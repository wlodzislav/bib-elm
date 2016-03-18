function Elm(options, el) {
	var existing = true;

	// components
	if (options.create) {
		if (el == null) {
			// HOOK: beforeCreate
			if (options.beforeCreate) {
				if (Array.isArray(options.beforeCreate)) {
					for (var m = 0; m < options.beforeCreate.length; m++) {
						options.beforeCreate[m](options);
					}
				} else {
					options.beforeCreate(options);
				}
			}

			el = options.create(options.attrs, options.children);
			existing = false;
		} else {
			// HOOK: component update
			el.update();
		}

	// DOM nodes
	} else {
		if (el == null) {
			// HOOK: beforeCreate
			if (options.beforeCreate) {
				if (Array.isArray(options.beforeCreate)) {
					for (var m = 0; m < options.beforeCreate.length; m++) {
						options.beforeCreate[m](options);
					}
				} else {
					options.beforeCreate(options);
				}
			}

			el = document.createElement(options.tag || "div");
			existing = false;
		}

		// create children
		if (!options.children) {
			options.children = [];
		}

		for (var i = 0, j = 0, len = options.children.length; i < len; i++) {
			var child = options.children[i];
			var removingChild;

			if (!child) {
				continue;
			}

			// rerending
			if (existing && el.childNodes[j]) {
				if (child.nodeType > 0) {
					if (child != el.childNodes[j]) {
						removingChild = el.childNodes[j];
						el.replaceChild(child, el.childNodes[j]);
						Elm.removeRecursive(removingChild);
					}
					j++;
				} else if (child.el && child.el.nodeType > 0) {
					if (child.el != el.childNodes[j]) {
						removingChild = el.childNodes[j];
						el.replaceChild(child.el, el.childNodes[j]);
						Elm.removeRecursive(removingChild);
					}
					j++;
				} else if (typeof(child) == "string") {
					var c = document.createTextNode(child);
					removingChild = el.childNodes[j];
					el.replaceChild(c, el.childNodes[j]);
					Elm.removeRecursive(removingChild);
					j++;
				} else if (Array.isArray(child)) {
					for (var p = 0, len2 = child.length; p < len2; p++) {
						var c = child[p];
						if (el.childNodes[j]) {
							if (el.childNodes[j].tagName.toLowerCase() == (c.tag || "div")) {
								Elm(c, el.childNodes[j]);
							} else {
								removingChild = el.childNodes[j];
								el.replaceChild(Elm(c), el.childNodes[j]);
								Elm.removeRecursive(removingChild);
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
						removingChild = el.childNodes[j];
						el.replaceChild(Elm(child), el.childNodes[j]);
						Elm.removeRecursive(removingChild);
					}
					j++;
				}

			// rending
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

		// remove trailing nodes
		if (existing && j < el.childNodes.length) {
			for (var i = 0, len = el.childNodes.length - j; i < len; i++) {
				var c = el.childNodes[j];
				Elm.removeRecursive(c);
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
	}

	// HOOK: afterCreate
	if (!existing && options.afterCreate) {
		if (Array.isArray(options.afterCreate)) {
			for (var m = 0; m < options.afterCreate.length; m++) {
				options.afterCreate[m](el, options);
			}
		} else {
			options.afterCreate(el, options);
		}
	}

	if (options.beforeRemove) {
		el.__elm_beforeRemove = options.beforeRemove;
	}

	if (options.remove) {
		el.__elm_remove = options.remove;
	}

	if (options.afterRemove) {
		el.__elm_afterRemove = options.afterRemove;
	}

	return el
}

if (typeof module == 'object' && module.exports) {
	module.exports = Elm;
} else {
	window.Elm = Elm;
}

Elm.removeRecursive = function (c) {
	// HOOK: beforeRemove
	if (c.__elm_beforeRemove) {
		if (Array.isArray(c.__elm_beforeRemove)) {
			for (var m = 0; m < c.__elm_beforeRemove.length; m++) {
				c.__elm_beforeRemove[m](c);
			}
		} else {
			c.__elm_beforeRemove(c);
		}
	}

	if (c.children && c.children.length != 0) {
		for (var m = 0; m < c.children.length; m++) {
			Elm.removeRecursive(c.children[m]);
		}
	}

	// HOOK: remove
	if (c.__elm_remove) {
		if (Array.isArray(c.__elm_remove)) {
			for (var m = 0; m < c.__elm_remove.length; m++) {
				c.__elm_remove[m](c);
			}
		} else {
			c.__elm_remove(c);
		}
	} else {
		if (c.parentNode) {
			c.parentNode.removeChild(c);
		}

		// HOOK: afterRemove
		if (c.__elm_afterRemove) {
			if (Array.isArray(c.__elm_afterRemove)) {
				for (var m = 0; m < c.__elm_afterRemove.length; m++) {
					c.__elm_afterRemove[m](c);
				}
			} else {
				c.__elm_afterRemove(c);
			}
		}
	}
};
