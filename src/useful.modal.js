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
			}
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
	};

}(window.useful = window.useful || {}));
