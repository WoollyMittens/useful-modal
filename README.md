# modal.js: Modal Popup Window

A link is opened in a modal window layer and animated using CSS3 transitions. It can be modified and closed from within the iframe.

Try the <a href="http://www.woollymittens.nl/default.php?url=useful-modal">demo</a>.

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

Or import into an MVC framework.

```js
var transitions = require('lib/transitions.js');
var Modal = require('js/modal.js');
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

## How to build the script

This project uses node.js from http://nodejs.org/

This project uses gulp.js from http://gulpjs.com/

The following commands are available for development:
+ `npm install` - Installs the prerequisites.
+ `gulp import` - Re-imports libraries from supporting projects to `./src/libs/` if available under the same folder tree.
+ `gulp dev` - Builds the project for development purposes.
+ `gulp dist` - Builds the project for deployment purposes.
+ `gulp watch` - Continuously recompiles updated files during development sessions.
+ `gulp serve` - Serves the project on a temporary web server at http://localhost:8500/.
+ `gulp php` - Serves the project on a temporary php server at http://localhost:8500/.

## License

This work is licensed under a [MIT License](https://opensource.org/licenses/MIT). The latest version of this and other scripts by the same author can be found on [Github](https://github.com/WoollyMittens) and at [WoollyMittens.nl](https://www.woollymittens.nl/).
