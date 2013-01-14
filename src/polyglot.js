/**
 * Polyglot.js
 * A simple libaray for doing clientside i18n
 * By Joe Pettersson / joepettersson.com/polyglot/ github.com/JoePettersson/polyglot
 * Version 0.0.1
 *
 * USAGE:
 * ------
 *
 * Config:
 *
 * Configuration of Polyglot is set in the Polyglot.CONFIG constant. By default, a
 * statically defined dictionary is loaded at page on page load (as seen in the example).
 *
 * However, if you would like to control the loading of the dictionary you can set
 * Polyglot.CONFIG.autoLoadDictionary to false. You must then invoke Polyglot.init() to
 * load the dictionary.
 *
 * Some people would like to have even more control over which dictionary is loaded when,
 * for instance loading 'dictionary_homepage.json' on one page and 'dictionary_pricing.json'
 * on another. This can acheived by explicitly passing an absolute local path to the
 * Polyglot.init() method. For instance Polyglot.init('/i18n/dictionary_pricing.json') will
 * override whatever is set in Polyglot.CONFIG.dictionaryUrl for that page.
 *
 * Translating strings:
 *
 * Once a dictionary has been loaded, you get a translation using the following Polyglot
 * public method: Polyglot.translate('i18n_key', 'iso_language_code'). Doing so will return
 * a string (providing one exists) in the language specified.
 *
 * The second language argument is optional, as if not specified the window.navigator.language
 * value is used. More here:
 * https://developer.mozilla.org/en-US/docs/DOM/window.navigator.language
 *
 * If a language is requested which does not exist in the dictionary the string corresponding
 * to the key in the Polygloy.CONFIG.defaultLang is returned.
 *
 * If a string is requested for translation that doesn't exist then the browser propogates the
 * expected error.
 *
 * Dictionary setup:
 *
 * Please see /app/data/i18n.json got a simple example.
 */
var Polyglot = {

	/**
	 * The Polyglot configutation object
	 * @type {Object}
	 */
	CONFIG: {
		dictionaryUrl: '/data/i18n.json',
		defaultLang: 'en-US',
		autoLoadDictionary: true
	},

	/**
	 * An instance object, into which our dictionary is written after retreival
	 * @type {Object}
	 */
	DATA: {},

	/**
	 * The Polyglot constructor method
	 * @param  {String} url An optional absolute local route that will override the CONFIG.dictionaryUrl value
	 */
	init: function (url) {
		'use strict';
		var self = this;

		self.CONFIG.dictionaryUrl = (typeof url !== 'undefined') ? url : self.CONFIG.dictionaryUrl;

		self.model.get(self, function (data) {
			self.DATA = data;
		});
	},

	/**
	 * The Polyglot model namespace
	 * @type {Object}
	 */
	model: {

		/**
		 * The method used to retreive a dictionary from a local URL
		 * @param  {Object}   parent   A reference to our top level Polyglot class
		 * @param  {Function} callback The callback
		 */
		get: function (parent, callback) {
			'use strict';
			var xmlHttp = null;

			xmlHttp = new XMLHttpRequest();
			xmlHttp.open('GET', parent.CONFIG.dictionaryUrl, false);
			xmlHttp.onreadystatechange = function () {
				if (xmlHttp.readyState === 4) {
					if (xmlHttp.status === 200) {
						callback(JSON.parse(xmlHttp.responseText));
					}
				} else {
					console.error('Polyglot loading error: ', xmlHttp.statusText);
				}
			};
			xmlHttp.send(null);
		},

		/**
		 * A utility method to check the existence of data in an arbitrary object
		 * @param  {Object} obj A reference to the object we're checking
		 * @return {Number}     The length of the object checked
		 */
		objSize: function (obj) {
			'use strict';
			var size = 0,
				key;
			for (key in obj) {
				if (obj.hasOwnProperty(key)) {
					size++;
				}
			}
			return size;
		}

	},

	/**
	 * The Polyglot public method to translate a string
	 * @param  {String} key      The key to translate
	 * @param  {String} language An optional attribute to denote which language to translate into
	 * @return {String}          The translated string
	 */
	translate: function (key, language) {
		'use strict';
		var self = this,
			lang = (typeof language === 'undefined') ? window.navigator.language.split('-') : language.split('-'),
			translatedStr;

		if (self.model.objSize(self.DATA) !== 0) {
			if (lang.length > 1) {
				translatedStr = (lang[0] in self.DATA) ? self.DATA[lang[0]][lang[1]][key] : self.getDefault(key, language);
			} else {
				translatedStr = (lang[0] in self.DATA) ? self.DATA[lang[0]][key] : self.getDefault(key, language);
			}
		} else {
			console.error('Polyglot data not loaded');
		}

		return translatedStr;
	},

	/**
	 * A pseudo private method to determine what the default value is for a key requested in a language not supported
	 * @param  {String} key      The key to translate
	 * @param  {String} language An optional attribute to denote which language to translate into
	 * @return {String}          The translated string
	 */
	getDefault: function (key, language) {
		'use strict';
		var self = this,
			lang = self.CONFIG.defaultLang.split('-'),
			defaultLangString;

		if (lang.length > 1) {
			defaultLangString = self.DATA[lang[0]][lang[1]][key];
		} else {
			defaultLangString = self.DATA[lang[0]][key];
		}

		console.warn(language + ' is not defined, returning string in default language');

		return defaultLangString;
	}

};

(function () {
	'use strict';
	if (Polyglot.CONFIG.autoLoadDictionary === true) {
		Polyglot.init();
	}
})();