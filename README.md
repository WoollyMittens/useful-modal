# modal.js: Modal Popup Window

*DEPRICATION WARNING: the functionality in this script has been superceeded / trivialised by updated web standards.*

A link is opened in a modal window layer and animated using CSS3 transitions. It can be modified and closed from within the iframe.

## How to include the script

The stylesheet is best included in the header of the document.

```html
<link rel="stylesheet" href="css/modal.css"/>
```

This include can be added to the header or placed inline before the script is invoked.

```html
<script src="lib/transitions.js"></script>
<script src="js/modal.js"></script>
```

Or use [Require.js](https://requirejs.org/).

```js
requirejs([
	'lib/transitions.js',
	'js/modal.js'
], function(transitions, Modal) {
	...
});
```

Or use imported as a component in existing projects.

```js
@import {transitions = require('lib/transitions.js";
@import {Modal} from "js/modal.js";
```

## How to start the script

```javascript
var modal = new Modal({
	'elements' : document.querySelectorAll('.openModal'),
	'id' : 'modalDialog'
});
```

**id : {string}** - The ID of the modal popup.

## How to control the script

### Open

```javascript
modal.open({'class' : 'default', 'title' : 'Modal Dialog', 'href' : './html/popup.html', 'width' : null, 'height' : null})
```

**class : {string}** - An optional CSS class name for the modal popup the script will create.

**title : {string}** - Overrides the title of the modal popup. By default this is the title attribute of the link or its inner text.

**href : {string}** - Overrides the URL loaded inside modal popup. By default this is the href attribute of the link.

**width : {integer}** - Overrides the width of the modal popup in pixels. By default this is defined in the stylesheet.

**height : {integer}** - Overrides the height of the modal popup in pixels. By default this is defined in the stylesheet.

### Update

```javascript
modal.update({'class' : 'yellow', 'title' : 'Altered Modal Dialog', 'href' : null, 'width' : 400, 'height' : 300})
```

Changes the properties of the popup.

### Close

```javascript
modal.close();
```

Closes the popup.

## License

This work is licensed under a [MIT License](https://opensource.org/licenses/MIT). The latest version of this and other scripts by the same author can be found on [Github](https://github.com/WoollyMittens).
