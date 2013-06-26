/*
	Source:
	van Creij, Maurice (2012). "modal.js: A simple modal dialog", version 20120606, http://www.woollymittens.nl/.

	License:
	This work is licensed under a Creative Commons Attribution 3.0 Unported License.

	Prerequisites:
	<script src="./js/useful.js"></script>
	<!--[if IE]>
		<script src="./js/html5.js"></script>
		<script src="//ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js"></script>
		<script src="//ajax.googleapis.com/ajax/libs/jqueryui/1.9.2/jquery-ui.min.js"></script>
	<![endif]-->
*/

(function (useful) {

	// invoke strict mode
	"use strict";

	// private functions
	var modal = {};
	modal = {
		// initialises the modal popup
		setup : function (node, options) {
			// set the onclick handler
			useful.events.add(node, 'click', function (event) {
				useful.events.cancel(event);
				modal.open(node, event, options);
			});
		},
		// shows contents in a modal popup - options = {id:'modalDialog', class:'themeName', title:'Lorem Ipsum', href:'about:blank', width:640, height:480, theme:keyword}
		open : function (node, event, options) {
			// determine the properties of the modal dialog
			if (!options.id) {
				options.id = 'modalDialog';
			}
			if (!options['class']) {
				options['class'] = (node.className.indexOf('class_') > -1) ?
					node.className.split('class_')[1].split(' ')[0] :
					'';
			}
			if (!options.title) {
				options.title = (node.title) ?
					node.title :
					node.innerHTML;
			}
			if (!options.href) {
				options.href = node.href;
			}
			if (!options.width) {
				options.width = (node.className.indexOf('width_') > -1) ?
					parseInt(node.className.split('width_')[1].split(' ')[0], 10) :
					null;
			}
			if (!options.height) {
				options.height = (node.className.indexOf('height_') > -1) ?
					parseInt(node.className.split('height_')[1].split(' ')[0], 10) :
					null;
			}
			// if an existing modal window exists
			var modalWrapper = document.getElementById(options.id);
			if (modalWrapper) {
				// quickly remove it
				modalWrapper.parentNode.removeChild(modalWrapper);
			}
			// create a wrapper for the popup
			modalWrapper = document.createElement('DIV');
			modalWrapper.setAttribute('id', options.id);
			modalWrapper.className = options['class'];
			// create the popup background
			var modalBackground = document.createElement('DIV');
			modalBackground.id = options.id + '_background';
			modalBackground.className = options.id + '_background_hidden';
			// create the popup foreground
			var modalForeground = document.createElement('DIV');
			modalForeground.id = options.id + '_foreground';
			modalForeground.className = options.id + '_foreground_hidden';
			// create the popup title
			var modalTitle = document.createElement('H1');
			modalTitle.innerHTML = options.title;
			modalTitle.id = options.id + '_title';
			// create the popup closer
			var modalCloser = document.createElement('BUTTON');
			modalCloser.innerHTML = 'X';
			modalCloser.id = options.id + '_closer';
			useful.events.add(modalCloser, 'click', function (event) {
				modal.close(options);
				useful.events.cancel(event);
			});
			// create the popup content
			var modalContent = document.createElement('IFRAME');
			modalContent.id = options.id + '_content';
			modalContent.name = options.id + '_iframe';
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
			modal.update({
				'id' : options.id,
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
				useful.css.setClass(modalBackground, 'modalDialog_background_hidden', 'modalDialog_background_visible');
				// reveal the foreground
				setTimeout(function () {
					useful.css.setClass(modalForeground, 'modalDialog_foreground_hidden', 'modalDialog_foreground_visible');
					// load the contents of the iframe
					setTimeout(function () {
						modalContent.src = options.href;
					}, 500);
				}, 500);
			}, 500);
			// cancel the default action
			useful.events.cancel(event);
		},
		// closes the modal popup
		close : function (options) {
			// if no id was given, assume the default
			if (!options.id) {
				options.id = 'modalDialog';
			}
			// if the modal popup node exists
			var modalWrapper = document.getElementById(options.id);
			if (modalWrapper) {
				var modalForeground = document.getElementById(options.id + '_foreground');
				var modalBackground = document.getElementById(options.id + '_background');
				// hide the foreground
				setTimeout(function () {
					useful.css.setClass(modalForeground, 'modalDialog_foreground_visible', 'modalDialog_foreground_hidden');
					// hide the background
					setTimeout(function () {
						useful.css.setClass(modalBackground, 'modalDialog_background_visible', 'modalDialog_background_hidden');
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
		},
		// resizes an open modal popup - options = {id:'modalDialog', class:'themeName', title:'Lorem Ipsum', href:'about:blank', width:640, height:480, theme:keyword}
		update : function (options) {
			// if no id was given, assume the default
			if (!options.id) {
				options.id = 'modalDialog';
			}
			// if the modal popup node exists
			var modalWrapper = document.getElementById(options.id);
			if (modalWrapper) {
				// get the target nodes
				modalWrapper = document.getElementById(options.id);
				var modalBackground = document.getElementById(options.id + '_background');
				var modalForeground = document.getElementById(options.id + '_foreground');
				var modalTitle = document.getElementById(options.id + '_title');
				var modalContent = document.getElementById(options.id + '_content');
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
		}
	};

	// public functions
	useful.events = useful.events || {};
	useful.events.add = function (element, eventName, eventHandler) {
		// exceptions
		eventName = (navigator.userAgent.match(/Firefox/i) && eventName.match(/mousewheel/i)) ? 'DOMMouseScroll' : eventName;
		// prefered method
		if ('addEventListener' in element) {
			element.addEventListener(eventName, eventHandler, false);
		}
		// alternative method
		else if ('attachEvent' in element) {
			element.attachEvent('on' + eventName, function (event) { eventHandler(event); });
		}
		// desperate method
		else {
			element['on' + eventName] = eventHandler;
		}
	};
	useful.events.cancel = function (event) {
		if (event) {
			if (event.preventDefault) { event.preventDefault(); }
			else if (event.preventManipulation) { event.preventManipulation(); }
			else { event.returnValue = false; }
		}
	};

	useful.models = useful.models || {};
	useful.models.clone = function (model) {
		var clonedModel, ClonedModel;
		// if the method exists
		if (typeof(Object.create) !== 'undefined') {
			clonedModel = Object.create(model);
		}
		// else use a fall back
		else {
			ClonedModel = function () {};
			ClonedModel.prototype = model;
			clonedModel = new ClonedModel();
		}
		// return the clone
		return clonedModel;
	};
	useful.models.trim = function (string) {
		return string.replace(/^\s+|\s+$/g, '');
	};

	useful.css = useful.css || {};
	useful.css.select = function (input, parent) {
		var a, b, elements;
		// validate the input
		parent = parent || document;
		input = (typeof input === 'string') ? {'rule' : input, 'parent' : parent} : input;
		input.parent = input.parent || document;
		input.data = input.data || {};
		// use querySelectorAll to select elements, or defer to jQuery
		elements = (typeof(document.querySelectorAll) !== 'undefined') ?
			input.parent.querySelectorAll(input.rule) :
			(typeof(jQuery) !== 'undefined') ? jQuery(input.parent).find(input.rule).get() : [];
		// if there was a handler
		if (typeof(input.handler) !== 'undefined') {
			// for each element
			for (a = 0 , b = elements.length; a < b; a += 1) {
				// run the handler and pass a unique copy of the data (in case it's a model)
				input.handler(elements[a], useful.models.clone(input.data));
			}
		// else assume the function was called for a list of elements
		} else {
			// return the selected elements
			return elements;
		}
	};
	useful.css.prefix = function (property) {
		// pick the prefix that goes with the browser
		return (navigator.userAgent.match(/webkit/gi)) ? 'webkit' + property.substr(0, 1).toUpperCase() + property.substr(1):
			(navigator.userAgent.match(/firefox/gi)) ? 'Moz' + property.substr(0, 1).toUpperCase() + property.substr(1):
			(navigator.userAgent.match(/microsoft/gi)) ? 'ms' + property.substr(0, 1).toUpperCase() + property.substr(1):
			(navigator.userAgent.match(/opera/gi)) ? 'O' + property.substr(0, 1).toUpperCase() + property.substr(1):
			property;
	};
	useful.css.compatibility = function () {
		var eventName, newDiv, empty;
		// create a test div
		newDiv = document.createElement('div');
		// use various tests for transition support
		if (typeof(newDiv.style.MozTransition) !== 'undefined') { eventName = 'transitionend'; }
		try { document.createEvent('OTransitionEvent'); eventName = 'oTransitionEnd'; } catch (e) { empty = null; }
		try { document.createEvent('WebKitTransitionEvent'); eventName = 'webkitTransitionEnd'; } catch (e) { empty = null; }
		try { document.createEvent('transitionEvent'); eventName = 'transitionend'; } catch (e) { empty = null; }
		// remove the test div
		newDiv = empty;
		// pass back working event name
		return eventName;
	};
	useful.css.setClass = function (element, removedClass, addedClass, endEventHandler, jQueryDuration, jQueryEasing) {
		var replaceThis, replaceWith, endEventName, endEventFunction;
		// validate the input
		endEventHandler = endEventHandler || function () {};
		endEventName = useful.css.compatibility();
		// turn the classnames into regular expressions
		replaceThis = new RegExp(useful.models.trim(removedClass).replace(/ {2,}/g, ' ').split(' ').join('|'), 'g');
		replaceWith = new RegExp(addedClass, 'g');
		// if CSS3 transitions are available
		if (typeof endEventName !== 'undefined') {
			// set the onComplete handler and immediately remove it afterwards
			element.addEventListener(endEventName, endEventFunction = function () {
				endEventHandler();
				element.removeEventListener(endEventName, endEventFunction, true);
			}, true);
			// replace the class name
			element.className = useful.models.trim(element.className.replace(replaceThis, '') + ' ' + addedClass).replace(/ {2,}/g, ' ');
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
			element.className = useful.models.trim(element.className.replace(replaceThis, '') + ' ' + addedClass).replace(/ {2,}/g, ' ');
			// and call the onComplete handler
			endEventHandler();
		}
	};

	useful.modal = {};
	useful.modal.setup = modal.setup;
	useful.modal.update = modal.update;
	useful.modal.close = modal.close;

}(window.useful = window.useful || {}));
