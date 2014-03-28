/*
	Source:
	van Creij, Maurice (2012). "useful.polyfills.js: A library of useful polyfills to ease working with HTML5 in legacy environments.", version 20121126, http://www.woollymittens.nl/.

	License:
	This work is licensed under a Creative Commons Attribution 3.0 Unported License.
*/

(function (useful) {

	// Invoke strict mode
	"use strict";

	// private functions
	var polyfills = polyfills || {};

	// enabled the use of HTML5 elements in Internet Explorer
	polyfills.html5 = function () {
		var a, b, elementsList;
		elementsList = ['section', 'nav', 'article', 'aside', 'hgroup', 'header', 'footer', 'dialog', 'mark', 'dfn', 'time', 'progress', 'meter', 'ruby', 'rt', 'rp', 'ins', 'del', 'figure', 'figcaption', 'video', 'audio', 'source', 'canvas', 'datalist', 'keygen', 'output', 'details', 'datagrid', 'command', 'bb', 'menu', 'legend'];
		if (navigator.userAgent.match(/msie/gi)) {
			for (a = 0 , b = elementsList.length; a < b; a += 1) {
				document.createElement(elementsList[a]);
			}
		}
	};

	// allow array.indexOf in older browsers
	polyfills.arrayIndexOf = function () {
		if (!Array.prototype.indexOf) {
			Array.prototype.indexOf = function (obj, start) {
				for (var i = (start || 0), j = this.length; i < j; i += 1) {
					if (this[i] === obj) { return i; }
				}
				return -1;
			};
		}
	};

	// allow document.querySelectorAll (https://gist.github.com/connrs/2724353)
	polyfills.querySelectorAll = function () {
		if (!document.querySelectorAll) {
			document.querySelectorAll = function (a) {
				var b = document, c = b.documentElement.firstChild, d = b.createElement("STYLE");
				return c.appendChild(d), b.__qsaels = [], d.styleSheet.cssText = a + "{x:expression(document.__qsaels.push(this))}", window.scrollBy(0, 0), b.__qsaels;
			};
		}
	};

	// allow addEventListener (https://gist.github.com/jonathantneal/3748027)
	polyfills.addEventListener = function () {
		!window.addEventListener && (function (WindowPrototype, DocumentPrototype, ElementPrototype, addEventListener, removeEventListener, dispatchEvent, registry) {
			WindowPrototype[addEventListener] = DocumentPrototype[addEventListener] = ElementPrototype[addEventListener] = function (type, listener) {
				var target = this;
				registry.unshift([target, type, listener, function (event) {
					event.currentTarget = target;
					event.preventDefault = function () { event.returnValue = false; };
					event.stopPropagation = function () { event.cancelBubble = true; };
					event.target = event.srcElement || target;
					listener.call(target, event);
				}]);
				this.attachEvent("on" + type, registry[0][3]);
			};
			WindowPrototype[removeEventListener] = DocumentPrototype[removeEventListener] = ElementPrototype[removeEventListener] = function (type, listener) {
				for (var index = 0, register; register = registry[index]; ++index) {
					if (register[0] == this && register[1] == type && register[2] == listener) {
						return this.detachEvent("on" + type, registry.splice(index, 1)[0][3]);
					}
				}
			};
			WindowPrototype[dispatchEvent] = DocumentPrototype[dispatchEvent] = ElementPrototype[dispatchEvent] = function (eventObject) {
				return this.fireEvent("on" + eventObject.type, eventObject);
			};
		})(Window.prototype, HTMLDocument.prototype, Element.prototype, "addEventListener", "removeEventListener", "dispatchEvent", []);
	};

	// allow console.log
	polyfills.consoleLog = function () {
		var overrideTest = new RegExp('console-log', 'i');
		if (!window.console || overrideTest.test(document.querySelectorAll('html')[0].className)) {
			window.console = {};
			window.console.log = function () {
				// if the reporting panel doesn't exist
				var a, b, messages = '', reportPanel = document.getElementById('reportPanel');
				if (!reportPanel) {
					// create the panel
					reportPanel = document.createElement('DIV');
					reportPanel.id = 'reportPanel';
					reportPanel.style.background = '#fff none';
					reportPanel.style.border = 'solid 1px #000';
					reportPanel.style.color = '#000';
					reportPanel.style.fontSize = '12px';
					reportPanel.style.padding = '10px';
					reportPanel.style.position = (navigator.userAgent.indexOf('MSIE 6') > -1) ? 'absolute' : 'fixed';
					reportPanel.style.right = '10px';
					reportPanel.style.bottom = '10px';
					reportPanel.style.width = '180px';
					reportPanel.style.height = '320px';
					reportPanel.style.overflow = 'auto';
					reportPanel.style.zIndex = '100000';
					reportPanel.innerHTML = '&nbsp;';
					// store a copy of this node in the move buffer
					document.body.appendChild(reportPanel);
				}
				// truncate the queue
				var reportString = (reportPanel.innerHTML.length < 1000) ? reportPanel.innerHTML : reportPanel.innerHTML.substring(0, 800);
				// process the arguments
				for (a = 0, b = arguments.length; a < b; a += 1) {
					messages += arguments[a] + '<br/>';
				}
				// add a break after the message
				messages += '<hr/>';
				// output the queue to the panel
				reportPanel.innerHTML = messages + reportString;
			};
		}
	};

	// allows Object.create (https://gist.github.com/rxgx/1597825)
	polyfills.objectCreate = function () {
		if (typeof Object.create !== "function") {
			Object.create = function (original) {
				function Clone() {}
				Clone.prototype = original;
				return new Clone();
			};
		}
	};

	// allows String.trim (https://gist.github.com/eliperelman/1035982)
	polyfills.stringTrim = function () {
		if (!String.prototype.trim) {
			String.prototype.trim = function () { return this.replace(/^[\s\uFEFF]+|[\s\uFEFF]+$/g, ''); };
		}
		if (!String.prototype.ltrim) {
			String.prototype.ltrim = function () { return this.replace(/^\s+/, ''); };
		}
		if (!String.prototype.rtrim) {
			String.prototype.rtrim = function () { return this.replace(/\s+$/, ''); };
		}
		if (!String.prototype.fulltrim) {
			String.prototype.fulltrim = function () { return this.replace(/(?:(?:^|\n)\s+|\s+(?:$|\n))/g, '').replace(/\s+/g, ' '); };
		}
	};

	// for immediate use
	polyfills.html5();
	polyfills.arrayIndexOf();
	polyfills.querySelectorAll();
	polyfills.addEventListener();
	polyfills.consoleLog();
	polyfills.objectCreate();
	polyfills.stringTrim();

}(window.useful = window.useful || {}));

/*
	Source:
	van Creij, Maurice (2012). "useful.transitions.js: A library of useful functions to ease working with CSS3 transitions.", version 20121126, http://www.woollymittens.nl/.

	License:
	This work is licensed under a Creative Commons Attribution 3.0 Unported License.

	Fallbacks:
	<!--[if IE]>
		<script src="//html5shiv.googlecode.com/svn/trunk/html5.js"></script>
		<script src="//ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min.js"></script>
		<script src="//ajax.googleapis.com/ajax/libs/jqueryui/1.9.2/jquery-ui.min.js"></script>
	<![endif]-->
*/

(function (useful) {

	// Invoke strict mode
	"use strict";

	// private functions
	var transitions = transitions || {};

	// applies functionality to node that conform to a given CSS rule, or returns them
	transitions.select = function (input, parent) {
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
			for (a = 0, b = elements.length; a < b; a += 1) {
				// run the handler and pass a unique copy of the data (in case it's a model)
				input.handler(elements[a], input.data.create());
			}
		// else assume the function was called for a list of elements
		} else {
			// return the selected elements
			return elements;
		}
	};

	// checks the compatibility of CSS3 transitions for this browser
	transitions.compatibility = function () {
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

	// performs a transition between two classnames
	transitions.byClass = function (element, removedClass, addedClass, endEventHandler, jQueryDuration, jQueryEasing) {
		var replaceThis, replaceWith, endEventName, endEventFunction;
		// validate the input
		endEventHandler = endEventHandler || function () {};
		endEventName = transitions.compatibility();
		// turn the classnames into regular expressions
		replaceThis = new RegExp(removedClass.trim().replace(/ {2,}/g, ' ').split(' ').join('|'), 'g');
		replaceWith = new RegExp(addedClass, 'g');
		// if CSS3 transitions are available
		if (typeof endEventName !== 'undefined') {
			// set the onComplete handler and immediately remove it afterwards
			element.addEventListener(endEventName, endEventFunction = function () {
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
	};

	// adds the relevant browser prefix to a style property
	transitions.prefix = function (property) {
		// pick the prefix that goes with the browser
		return (navigator.userAgent.match(/webkit/gi)) ? 'webkit' + property.substr(0, 1).toUpperCase() + property.substr(1):
			(navigator.userAgent.match(/firefox/gi)) ? 'Moz' + property.substr(0, 1).toUpperCase() + property.substr(1):
			(navigator.userAgent.match(/microsoft/gi)) ? 'ms' + property.substr(0, 1).toUpperCase() + property.substr(1):
			(navigator.userAgent.match(/opera/gi)) ? 'O' + property.substr(0, 1).toUpperCase() + property.substr(1):
			property;
	};

	// applies a list of rules
	transitions.byRules = function (element, rules, endEventHandler) {
		var rule, endEventName, endEventFunction;
		// validate the input
		rules.transitionProperty = rules.transitionProperty || 'all';
		rules.transitionDuration = rules.transitionDuration || '300ms';
		rules.transitionTimingFunction = rules.transitionTimingFunction || 'ease';
		endEventHandler = endEventHandler || function () {};
		endEventName = transitions.compatibility();
		// if CSS3 transitions are available
		if (typeof endEventName !== 'undefined') {
			// set the onComplete handler and immediately remove it afterwards
			element.addEventListener(endEventName, endEventFunction = function () {
				endEventHandler();
				element.removeEventListener(endEventName, endEventFunction, true);
			}, true);
			// for all rules
			for (rule in rules) {
				if (rules.hasOwnProperty(rule)) {
					// implement the prefixed value
					element.style[transitions.compatibility(rule)] = rules[rule];
					// implement the value
					element.style[rule] = rules[rule];
				}
			}
		// else if jQuery is available
		} else if (typeof jQuery !== 'undefined') {
			var jQueryEasing, jQueryDuration;
			// pick the equivalent jQuery animation function
			jQueryEasing = (rules.transitionTimingFunction.match(/ease/gi)) ? 'swing' : 'linear';
			jQueryDuration = parseInt(rules.transitionDuration.replace(/s/g, '000').replace(/ms/g, ''), 10);
			// remove rules that will make Internet Explorer complain
			delete rules.transitionProperty;
			delete rules.transitionDuration;
			delete rules.transitionTimingFunction;
			// use animate from jQuery
			jQuery(element).animate(
				rules,
				jQueryDuration,
				jQueryEasing,
				endEventHandler
			);
		// else
		} else {
			// for all rules
			for (rule in rules) {
				if (rules.hasOwnProperty(rule)) {
					// implement the prefixed value
					element.style[transitions.compatibility(rule)] = rules[rule];
					// implement the value
					element.style[rule] = rules[rule];
				}
			}
			// call the onComplete handler
			endEventHandler();
		}
	};

	// public functions
	useful.transitions = useful.transitions || {};
	useful.transitions.select = transitions.select;
	useful.transitions.byClass = transitions.byClass;
	useful.transitions.byRules = transitions.byRules;

}(window.useful = window.useful || {}));

/*
	Source:
	van Creij, Maurice (2012). "context.js: A simple modal dialog", version 20120606, http://www.woollymittens.nl/.

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
	useful.Modal = function (objs, cfg) {
		// properties
		this.objs = objs;
		this.cfg = cfg;
		// methods
		this.start = function () {
			var a, b, context = this;
			// for all the provided objects
			for (a = 0, b = context.objs.length; a < b; a += 1) {
				// set the onclick handler
				context.objs[a].addEventListener('click', this.onOpen(context.objs[a], context), false);
			}
			// disable the start function so it can't be started twice
			this.start = function () {};
		};
		// click handler
		this.onOpen = function (element, context) {
			return function (event) {
				// cancel the default action
				event.preventDefault();
				// get the options from the target element
				var options = {};
				options['class'] = (element.getAttribute('data-modal-class')) ? element.getAttribute('data-modal-class') : '';
				options.title = (element.title) ? element.title : element.innerHTML;
				options.href = element.href;
				options.width = (element.getAttribute('data-modal-width')) ? parseInt(element.getAttribute('data-modal-width'), 10) : null;
				options.height = (element.getAttribute('data-modal-height')) ? parseInt(element.getAttribute('data-modal-height'), 10) : null;
				// open the modal dialog
				context.open(options);
			};
		};
		// shows contents in a modal popup - options = {class:'themeName', title:'Lorem Ipsum', href:'about:blank', width:640, height:480}
		this.open = function (options) {
			var context = this;
			// if an existing modal window exists
			var modalWrapper = document.getElementById(context.cfg.id);
			if (modalWrapper) {
				// quickly remove it
				modalWrapper.parentNode.removeChild(modalWrapper);
			}
			// create a wrapper for the popup
			modalWrapper = document.createElement('DIV');
			modalWrapper.setAttribute('id', context.cfg.id);
			modalWrapper.className = options['class'];
			// create the popup background
			var modalBackground = document.createElement('DIV');
			modalBackground.id = context.cfg.id + '_background';
			modalBackground.className = context.cfg.id + '_background_hidden';
			// create the popup foreground
			var modalForeground = document.createElement('DIV');
			modalForeground.id = context.cfg.id + '_foreground';
			modalForeground.className = context.cfg.id + '_foreground_hidden';
			// create the popup title
			var modalTitle = document.createElement('H1');
			modalTitle.innerHTML = options.title;
			modalTitle.id = context.cfg.id + '_title';
			// create the popup closer
			var modalCloser = document.createElement('BUTTON');
			modalCloser.innerHTML = 'X';
			modalCloser.id = context.cfg.id + '_closer';
			modalCloser.addEventListener('click', function (event) {
				context.close(context);
				event.preventDefault();
			}, false);
			// create the popup content
			var modalContent = document.createElement('IFRAME');
			modalContent.id = context.cfg.id + '_content';
			modalContent.name = context.cfg.id + '_iframe';
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
			context.update({
				'id' : context.cfg.id,
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
				useful.transitions.byClass(modalBackground, context.cfg.id + '_background_hidden', context.cfg.id + '_background_visible');
				// reveal the foreground
				setTimeout(function () {
					useful.transitions.byClass(modalForeground, context.cfg.id + '_foreground_hidden', context.cfg.id + '_foreground_visible');
					// load the contents of the iframe
					setTimeout(function () {
						modalContent.src = options.href;
					}, 500);
				}, 500);
			}, 500);
		};
		// closes the modal popup
		this.close = function (options) {
			var context = this;
			// if the modal popup node exists
			var modalWrapper = document.getElementById(context.cfg.id);
			if (modalWrapper) {
				var modalForeground = document.getElementById(context.cfg.id + '_foreground');
				var modalBackground = document.getElementById(context.cfg.id + '_background');
				// hide the foreground
				setTimeout(function () {
					useful.transitions.byClass(modalForeground, context.cfg.id + '_foreground_visible', context.cfg.id + '_foreground_hidden');
					// hide the background
					setTimeout(function () {
						useful.transitions.byClass(modalBackground, context.cfg.id + '_background_visible', context.cfg.id + '_background_hidden');
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
			var context = this;
			// if the modal popup node exists
			var modalWrapper = document.getElementById(context.cfg.id);
			if (modalWrapper) {
				// get the target nodes
				modalWrapper = document.getElementById(context.cfg.id);
				var modalBackground = document.getElementById(context.cfg.id + '_background');
				var modalForeground = document.getElementById(context.cfg.id + '_foreground');
				var modalTitle = document.getElementById(context.cfg.id + '_title');
				var modalContent = document.getElementById(context.cfg.id + '_content');
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
		// go
		this.start();
	};

}(window.useful = window.useful || {}));
