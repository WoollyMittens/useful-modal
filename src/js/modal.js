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
if (typeof define != 'undefined') define([], function () { return Modal });
if (typeof module != 'undefined') module.exports = Modal;
