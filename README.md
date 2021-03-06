# Elm - Simple to use .createElement helper

## Example

```js
var cancel = Elm({ tag: "button", class: "btn",
	textContent: "Cancel",
	onclick: function () { console.log("Cancel"); }
});

var el = Elm({ tag: "span", class: "btn-group", children: [
	{ tag: "button", class: "btn",
		textContent: "Send",
		onclick: function () { console.log("Send"); }
	},
	cancel // cancel is DOM node
]});

// rerender
Elm({ tag: "span", class: "btn-group", children: [
	{ tag: "button", class: "btn disabled", // change class
		textContent: "Send",
		onclick: function () { console.log("Send"); }
	},
	cancel // cancel doen't change
]}, el);

// or alternative syntax
Elm({ tag: "span", attrs: { class: "btn-group" }, children: [
	{ tag: "button", attrs: { class: "btn disabled",
		textContent: "Send",
		onclick: function () { console.log("Send"); }
	}},
	cancel // cancel doen't change
]}, el);
```

## Elm(options, [node])

If node is specified Elm incrementally rerenders node with given ast.

Note! Root node tag couldn't be changed.

`options` properties may be any DOM node properties or attributes, all unknown properties become node attributes

Special properties of `options`:

`tag` - tag, by default "div"

`attrs` - object, attributes, properties for DOM node, including style object

`children` - array of children, each child may be `options` object, DOM node, any object with poroperty `.el` which is DOM node, text string. If child is null/undefined it's ignored

`style` - string or object which sets inline style through node.style, `{ "fontSize": "10px" }`

`beforeCreate` - function/array of `function(options)` which is called with current options before DOM node is rendered

`afterCreate` - function/array of `function(el)`, called after DOM node created

`beforeRemove` - function/array of `function(el)`, called before DOM node is removed

`remove` - function/array of `function(el)`, removes DOM node

`afterRemove` - function/array of `function(el)`, called after DOM node is removed, ignored when `remove` specified

## Rerending

Rerending is done id D3.js-like way with update/create/remove sections.

When rerendered all childrens properties and attributes are overwritten, if there are more nodes in the new tree - nodes are created, if there are less - removed from the DOM. Nodes are created and removed only at the end of children array.

For example:

```js
var el = Elm({ children: [
	{ class: "task", textContent: "Task 1" },
	{ class: "task", textContent: "Task 2" },
	{ class: "task", textContent: "Task 3" }
]});
```

Mark second task done:

```js
Elm({ children: [ // root left intact
	{ class: "task", textContent: "Task 1" }, // `class`, `textContent` overwritten
	{ class: "task done", textContent: "Task 2" }, // `class`, `textContent` overwritten
	{ class: "task", textContent: "Task 3" } // `class`, `textContent` overwritten
]}, el);
```

Then add task 4:

```js
Elm({ children: [ // root left intact
	{ class: "task", textContent: "Task 1" }, // `class`, `textContent` overwritten
	{ class: "task done", textContent: "Task 2" }, // `class`, `textContent` overwritten
	{ class: "task", textContent: "Task 3" }, // `class`, `textContent` overwritten
	{ class: "task", textContent: "Task 4" } // node created
]}, el);
```

Remove task 2:

```js
Elm({ children: [ // root left intact
	{ class: "task", textContent: "Task 1" }, // `class`, `textContent` overwritten
	{ class: "task", textContent: "Task 3" }, // task 2 node, `class`, `textContent` overwritten
	{ class: "task", textContent: "Task 4" } // task 3 node, `class`, `textContent` overwritten
	// task 4 node removed
]}, el);
```

