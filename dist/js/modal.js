/*
	Source:
	van Creij, Maurice (2018). "transitions.js: A library of useful functions to ease working with CSS3 transitions.", http://www.woollymittens.nl/.

	License:
	This work is licensed under a Creative Commons Attribution 3.0 Unported License.
*/

// establish the class
var transitions = {

	// applies functionality to node that conform to a given CSS rule, or returns them
	select: function(input, parent) {
		var a,
			b,
			elements;
		// validate the input
		parent = parent || document.body;
		input = (typeof input === 'string')
			? {
				'rule': input,
				'parent': parent
			}
			: input;
		input.parent = input.parent || document;
		input.data = input.data || {};
		// use querySelectorAll to select elements, or defer to jQuery
		elements = (typeof(document.querySelectorAll) !== 'undefined')
			? input.parent.querySelectorAll(input.rule)
			: (typeof(jQuery) !== 'undefined')
				? jQuery(input.parent).find(input.rule).get()
				: [];
		// if there was a handler
		if (typeof(input.handler) !== 'undefined') {
			// for each element
			for (a = 0, b = elements.length; a < b; a += 1) {
				// run the handler and pass a unique copy of the data (in case it's a model)
				input.handler(elements[a], input.data.create());
			}
			// else assume the function was called for a list of elements
		} else {
			// return the selected elements
			return elements;
		}
	},

	// checks the compatibility of CSS3 transitions for this browser
	compatibility: function() {
		var eventName,
			newDiv,
			empty;
		// create a test div
		newDiv = document.createElement('div');
		// use various tests for transition support
		if (typeof(newDiv.style.MozTransition) !== 'undefined') {
			eventName = 'transitionend';
		}
		try {
			document.createEvent('OTransitionEvent');
			eventName = 'oTransitionEnd';
		} catch (e) {
			empty = null;
		}
		try {
			document.createEvent('WebKitTransitionEvent');
			eventName = 'webkitTransitionEnd';
		} catch (e) {
			empty = null;
		}
		try {
			document.createEvent('transitionEvent');
			eventName = 'transitionend';
		} catch (e) {
			empty = null;
		}
		// remove the test div
		newDiv = empty;
		// pass back working event name
		return eventName;
	},

	// performs a transition between two classnames
	byClass: function(element, removedClass, addedClass, endEventHandler, jQueryDuration, jQueryEasing) {
		var replaceThis,
			replaceWith,
			endEventName,
			endEventFunction;
		// validate the input
		endEventHandler = endEventHandler || function() {};
		endEventName = this.compatibility();
		// turn the classnames into regular expressions
		replaceThis = new RegExp(removedClass.trim().replace(/ {2,}/g, ' ').split(' ').join('|'), 'g');
		replaceWith = new RegExp(addedClass, 'g');
		// if CSS3 transitions are available
		if (typeof endEventName !== 'undefined') {
			// set the onComplete handler and immediately remove it afterwards
			element.addEventListener(endEventName, endEventFunction = function() {
				endEventHandler();
				element.removeEventListener(endEventName, endEventFunction, true);
			}, true);
			// replace the class name
			element.className = (element.className.replace(replaceThis, '') + ' ' + addedClass).replace(/ {2,}/g, ' ').trim();
			// else if jQuery UI is available
		} else if (typeof jQuery !== 'undefined' && typeof jQuery.ui !== 'undefined') {
			// retrieve any extra information for jQuery
			jQueryDuration = jQueryDuration || 500;
			jQueryEasing = jQueryEasing || 'swing';
			// use switchClass from jQuery UI to approximate CSS3 transitions
			jQuery(element).switchClass(removedClass.replace(replaceWith, ''), addedClass, jQueryDuration, jQueryEasing, endEventHandler);
			// if all else fails
		} else {
			// just replace the class name
			element.className = (element.className.replace(replaceThis, '') + ' ' + addedClass).replace(/ {2,}/g, ' ').trim();
			// and call the onComplete handler
			endEventHandler();
		}
	},

	// adds the relevant browser prefix to a style property
	prefix: function(property) {
		// pick the prefix that goes with the browser
		return (navigator.userAgent.match(/webkit/gi))
			? 'webkit' + property.substr(0, 1).toUpperCase() + property.substr(1)
			: (navigator.userAgent.match(/firefox/gi))
				? 'Moz' + property.substr(0, 1).toUpperCase() + property.substr(1)
				: (navigator.userAgent.match(/microsoft/gi))
					? 'ms' + property.substr(0, 1).toUpperCase() + property.substr(1)
					: (navigator.userAgent.match(/opera/gi))
						? 'O' + property.substr(0, 1).toUpperCase() + property.substr(1)
						: property;
	},

	// applies a list of rules
	byRules: function(element, rules, endEventHandler) {
		var rule,
			endEventName,
			endEventFunction;
		// validate the input
		rules.transitionProperty = rules.transitionProperty || 'all';
		rules.transitionDuration = rules.transitionDuration || '300ms';
		rules.transitionTimingFunction = rules.transitionTimingFunction || 'ease';
		endEventHandler = endEventHandler || function() {};
		endEventName = this.compatibility();
		// if CSS3 transitions are available
		if (typeof endEventName !== 'undefined') {
			// set the onComplete handler and immediately remove it afterwards
			element.addEventListener(endEventName, endEventFunction = function() {
				endEventHandler();
				element.removeEventListener(endEventName, endEventFunction, true);
			}, true);
			// for all rules
			for (rule in rules) {
				if (rules.hasOwnProperty(rule)) {
					// implement the prefixed value
					element.style[this.compatibility(rule)] = rules[rule];
					// implement the value
					element.style[rule] = rules[rule];
				}
			}
			// else if jQuery is available
		} else if (typeof jQuery !== 'undefined') {
			var jQueryEasing,
				jQueryDuration;
			// pick the equivalent jQuery animation function
			jQueryEasing = (rules.transitionTimingFunction.match(/ease/gi))
				? 'swing'
				: 'linear';
			jQueryDuration = parseInt(rules.transitionDuration.replace(/s/g, '000').replace(/ms/g, ''), 10);
			// remove rules that will make Internet Explorer complain
			delete rules.transitionProperty;
			delete rules.transitionDuration;
			delete rules.transitionTimingFunction;
			// use animate from jQuery
			jQuery(element).animate(rules, jQueryDuration, jQueryEasing, endEventHandler);
			// else
		} else {
			// for all rules
			for (rule in rules) {
				if (rules.hasOwnProperty(rule)) {
					// implement the prefixed value
					element.style[this.compatibility(rule)] = rules[rule];
					// implement the value
					element.style[rule] = rules[rule];
				}
			}
			// call the onComplete handler
			endEventHandler();
		}
	}

};

// return as a require.js module
if (typeof module !== 'undefined') {
	exports = module.exports = transitions;
}

/*
	Source:
	van Creij, Maurice (2018). "_this.js: A simple modal dialog", http://www.woollymittens.nl/.

	License:
	This work is licensed under a Creative Commons Attribution 3.0 Unported License.
*/


// establish the class
var Modal = function (config) {

	// PROPERTIES

	this.config = config;
	this.elements = config.elements;

	// METHODS

	this.start = function () {
		var a, b;
		// for all the provided objects
		for (a = 0, b = this.elements.length; a < b; a += 1) {
			// set the onclick handler
			this.elements[a].addEventListener('click', this.onOpen.bind(this, this.elements[a]));
		}
		// disable the start function so it can't be started twice
		this.init = function () {};
	};

	// click handler
	this.onOpen = function (element, evt) {
		// cancel the default action
		evt.preventDefault();
		// get the options from the target element
		var options = {};
		options['class'] = (element.getAttribute('data-modal-class')) ? element.getAttribute('data-modal-class') : '';
		options.title = (element.title) ? element.title : element.innerHTML;
		options.href = element.href;
		options.width = (element.getAttribute('data-modal-width')) ? parseInt(element.getAttribute('data-modal-width'), 10) : null;
		options.height = (element.getAttribute('data-modal-height')) ? parseInt(element.getAttribute('data-modal-height'), 10) : null;
		// open the modal dialog
		this.open(options);
	};

	// shows contents in a modal popup - options = {class:'themeName', title:'Lorem Ipsum', href:'about:blank', width:640, height:480}
	this.open = function (options) {
		var _this = this;
		// if an existing modal window exists
		var modalWrapper = document.getElementById(this.config.id);
		if (modalWrapper) {
			// quickly remove it
			modalWrapper.parentNode.removeChild(modalWrapper);
		}
		// create a wrapper for the popup
		modalWrapper = document.createElement('DIV');
		modalWrapper.setAttribute('id', this.config.id);
		modalWrapper.className = options['class'];
		// create the popup background
		var modalBackground = document.createElement('DIV');
		modalBackground.id = this.config.id + '_background';
		modalBackground.className = this.config.id + '_background_hidden';
		// create the popup foreground
		var modalForeground = document.createElement('DIV');
		modalForeground.id = this.config.id + '_foreground';
		modalForeground.className = this.config.id + '_foreground_hidden';
		// create the popup title
		var modalTitle = document.createElement('H1');
		modalTitle.innerHTML = options.title;
		modalTitle.id = this.config.id + '_title';
		// create the popup closer
		var modalCloser = document.createElement('BUTTON');
		modalCloser.innerHTML = 'X';
		modalCloser.id = this.config.id + '_closer';
		modalCloser.addEventListener('click', function (event) {
			_this.close(_this);
			event.preventDefault();
		}, false);
		// create the popup content
		var modalContent = document.createElement('IFRAME');
		modalContent.id = this.config.id + '_content';
		modalContent.name = this.config.id + '_iframe';
		modalContent.setAttribute('frameborder', 0);
		// paste the modal window together
		modalWrapper.appendChild(modalBackground);
		modalForeground.appendChild(modalTitle);
		modalForeground.appendChild(modalCloser);
		modalForeground.appendChild(modalContent);
		modalWrapper.appendChild(modalForeground);
		// place the popup in the page
		document.body.appendChild(modalWrapper);
		// apply the given dimensions
		this.update({
			'id' : _this.config.id,
			'width' : options.width,
			'height' : options.height
		});
		// hide all the select elements for internet explorer 6
		if (navigator.userAgent.indexOf('MSIE 6') > -1) {
			var allSelects = document.getElementsByTagName('SELECT');
			for (var a = 0, b = allSelects.length; a < b; a += 1) {
				allSelects[a].style.visibility = 'hidden';
			}
		}
		// reveal the background
		setTimeout(function () {
			transitions.byClass(modalBackground, _this.config.id + '_background_hidden', _this.config.id + '_background_visible');
			// reveal the foreground
			setTimeout(function () {
				transitions.byClass(modalForeground, _this.config.id + '_foreground_hidden', _this.config.id + '_foreground_visible');
				// load the contents of the iframe
				setTimeout(function () {
					modalContent.src = options.href;
				}, 500);
			}, 500);
		}, 500);
	};

	// closes the modal popup
	this.close = function (options) {
		var _this = this;
		// if the modal popup node exists
		var modalWrapper = document.getElementById(this.config.id);
		if (modalWrapper) {
			var modalForeground = document.getElementById(this.config.id + '_foreground');
			var modalBackground = document.getElementById(this.config.id + '_background');
			// hide the foreground
			setTimeout(function () {
				transitions.byClass(modalForeground, _this.config.id + '_foreground_visible', _this.config.id + '_foreground_hidden');
				// hide the background
				setTimeout(function () {
					transitions.byClass(modalBackground, _this.config.id + '_background_visible', _this.config.id + '_background_hidden');
					// remove the popup
					setTimeout(function () {
						modalWrapper.parentNode.removeChild(modalWrapper);
					}, 500);
				}, 500);
			}, 500);
		}
		// show all the select elements for internet explorer 6
		if (navigator.userAgent.indexOf('MSIE 6') > -1) {
			var allSelects = document.getElementsByTagName('SELECT');
			for (var a = 0, b = allSelects.length; a < b; a += 1) {
				allSelects[a].style.visibility = 'visible';
			}
		}
	};

	// resizes an open modal popup - options = {class:'themeName', title:'Lorem Ipsum', href:'about:blank', width:640, height:480, theme:keyword}
	this.update = function (options) {
		// if the modal popup node exists
		var modalWrapper = document.getElementById(this.config.id);
		if (modalWrapper) {
			// get the target nodes
			modalWrapper = document.getElementById(this.config.id);
			var modalBackground = document.getElementById(this.config.id + '_background');
			var modalForeground = document.getElementById(this.config.id + '_foreground');
			var modalTitle = document.getElementById(this.config.id + '_title');
			var modalContent = document.getElementById(this.config.id + '_content');
			// if there's a theme
			if (options['class']) {
				modalWrapper.className = options['class'];
			}
			// if there's a title
			if (options.title) {
				// update the title
				modalTitle.innerHTML = options.title;
			}
			// if there's a content
			if (options.href) {
				// update the content
				modalContent.src = options.href;
			}
			// if there's a width
			if (options.width) {
				// update the width
				modalForeground.style.width = options.width + 'px';
				modalContent.width = options.width;
				modalContent.style.width = options.width + 'px';
				// update the position
				modalForeground.style.marginLeft = Math.round(-1 * options.width / 2) + 'px';
			}
			// if there's a height
			if (options.height) {
				// update the height
				modalForeground.style.height = (options.height + modalTitle.offsetHeight) + 'px';
				modalContent.height = options.height;
				modalContent.style.height = options.height + 'px';
				// update the position
				modalForeground.style.marginTop = Math.round(-1 * (options.height + modalTitle.offsetHeight) / 2) + 'px';
			}
			// if this is internet explorer 6
			if (navigator.userAgent.indexOf('MSIE 6') > -1) {
				// size the background manualy
				modalWrapper.style.height = document.body.offsetHeight + 'px';
				modalBackground.style.height = document.body.offsetHeight + 'px';
			}
		}
	};

	// EVENTS

	// go
	this.start();
};

// return as a require.js module
if (typeof module !== 'undefined') {
	exports = module.exports = Modal;
}
