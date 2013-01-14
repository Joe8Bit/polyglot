##Polyglot
Polyglot is a very simple string replacement i18n library I built for a personal project and thought was self contained enough to warrant it's own repo. It's very simple to use, and does what it does very quickly indeed.

However, it is *not* a full i18n solution, it does not do any kind of: date; currency; time or any other i18n functions you might expect. It does one thing and does it well. It may do those things in the future however.

####Config
Configuration of Polyglot is set in the `Polyglot.CONFIG` constant. By default, a statically defined dictionary is loaded at page on page load (as seen in the example).

However, if you would like to control the loading of the dictionary you can set `Polyglot.CONFIG.autoLoadDictionary` to `false`. You must then invoke `Polyglot.init()` to load the dictionary.

Some people would like to have even more control over which dictionary is loaded when, for instance loading `'dictionary_homepage.json'` on one page and `'dictionary_pricing.json'` on another. This can acheived by explicitly passing an absolute local path to the `Polyglot.init()` method. For instance `Polyglot.init('/i18n/dictionary_pricing.json')` will override whatever is set in `Polyglot.CONFIG.dictionaryUrl` for that page.

####Translating strings
Once a dictionary has been loaded, you get a translation using the following Polyglot public method: `Polyglot.translate('i18n_key', 'iso_language_code')`. Doing so will return a string (providing one exists) in the language specified.

The second language argument is optional, as if not specified the `window.navigator.language` value is used. More here: [https://developer.mozilla.org/en-US/docs/DOM/window.navigator.language](https://developer.mozilla.org/en-US/docs/DOM/window.navigator.language)

If a language is requested which does not exist in the dictionary the string corresponding to the key in the `Polygloy.CONFIG.defaultLang` is returned.

####Dictionary setup
Please see `/app/data/i18n.json` got a simple example.

###Examples
The `app/` directory contains several examples. This simple project is built using the [Yeoman](http://yeoman.io) toolchain, so getting the example up and running is a matter of installing Yeoman and the running the `yeoman server` command.

###Tests
Testing is done in Mocha and the specs are contained within the root `tests/` directory. Running them is as simple as running the `yeoman test` command.
