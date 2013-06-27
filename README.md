# useful.modal.js: Modal Popup Window

A link is opened in a modal window layer and animated using CSS3 transitions. It can be modified and closed from within the iframe.

Try the <a href="http://www.woollymittens.nl/useful/default.php?url=modal">modal demo</a>.

## How to use the script

The stylesheet is best included in the header of the document.

```html
<link rel="stylesheet" href="./css/modal.css"/>
```

This include can be added to the header or placed inline before the script is invoked.

```html
<script src="./js/useful.modal.js"></script>
```

To enable the use of HTML5 tags in Internet Explorer 8 and lower, include *html5.js*. To provide an alternative for *document.querySelectorAll* in Internet Explorer 8 and lower, include *jQuery*. To enable CSS3 transition animations in Internet Explorer 9 and lower, include *jQuery UI* as well.

```html
<!--[if lte IE 9]>
	<script src="//html5shiv.googlecode.com/svn/trunk/html5.js"></script>
	<script src="//ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js"></script>
	<script src="//ajax.googleapis.com/ajax/libs/jqueryui/1.9.2/jquery-ui.min.js"></script>
<![endif]-->
```

### Using vanilla JavaScript

This is the safest way of starting the script, but allows for only one target element at a time.

```javascript
var parent = documentGetElementById('id');
useful.modal.setup(parent, {
	'id' : 'modalDialog',
	'class' : null,
	'title' : null,
	'href' : null,
	'width' : null,
	'height' : null
});
```

**id : {string}** - The ID attribute of an element somewhere in the document.

**parent : {DOM node}** - The DOM element around which the functionality is centred.

**id : {string}** - The ID of the modal popup the script will create.

**class : {string}** - An optional CSS class name for the modal popup the script will create.

**title : {string}** - Overrides the title of the modal popup. By default this is the title attribute of the link or its inner text.

**href : {string}** - Overrides the URL loaded inside modal popup. By default this is the href attribute of the link.

**width : {integer}** - Overrides the width of the modal popup in pixels. By default this is defined in the stylesheet.

**height : {integer}** - Overrides the height of the modal popup in pixels. By default this is defined in the stylesheet.

```javascript
var changes = {'id' : 'modalDialog', 'class' : 'yellow', 'title' : 'Altered Modal Dialog', 'href' : null, 'width' : 400, 'height' : 300};
useful.modal.update(changes)
```

**id : {string}** - The ID of the popup to alter.

**changes : {object}** - An object with any combination of possible new values for the popup's properties

```javascript
useful.modal.close({'id' : 'modalDialog'});
```

**id : {string}** - The ID of the popup to close.

### Using document.querySelectorAll

This method allows CSS Rules to be used to apply the script to one or more nodes at the same time.

```javascript
useful.css.select({
	rule : '.openModal',
	handler : useful.modal.setup,
	data : {
		'id' : 'modalDialog',
		'class' : null,
		'title' : null,
		'href' : null,
		'width' : null,
		'height' : null
	}
});
```

**rule : {string}** - The CSS Rule for the intended target(s) of the script.

**handler : {function}** - The public function that starts the script.

**data : {object}** - Name-value pairs with configuration data.

### Using jQuery

This method is similar to the previous one, but uses jQuery for processing the CSS rule.

```javascript
$('.openModal').each(function (index, element) {
	useful.modal.setup(element, {
		'id' : 'modalDialog',
		'class' : null,
		'title' : null,
		'href' : null,
		'width' : null,
		'height' : null
	});
});
```

## License
This work is licensed under a Creative Commons Attribution 3.0 Unported License. The latest version of this and other scripts by the same author can be found at http://www.woollymittens.nl/
