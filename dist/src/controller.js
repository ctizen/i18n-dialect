"use strict";
exports.__esModule = true;
var TranslationController = (function () {
    function TranslationController(translationGetter, onFailedSubstitution, defaultPluralSelect) {
        this.translationGetter = translationGetter;
        this.onFailedSubstitution = onFailedSubstitution;
        this.defaultPluralSelect = defaultPluralSelect;
        this.dictionary = {};
    }
    TranslationController.prototype.getString = function (descriptor) {
        var key = this.getDictKeyForDescriptor(descriptor);
        var translationForms = key && this.dictionary[key] || this.getUntranslatedFallback(descriptor);
        var translation = this.selectPluralForm(translationForms, descriptor);
        return this.substituteStrings(translation, descriptor);
    };
    TranslationController.prototype.setLocale = function (localeName, onReady, // called with new locale name when loading is finished
        onError) {
        var _this = this;
        this.translationGetter(localeName, function (name, contents) {
            var poData = JSON.parse(contents); // TODO: better json schema validation?
            if (!poData.items || !poData.meta) {
                onError && onError('Invalid format of translation file');
                return;
            }
            try {
                var dictionary = _this.makeNewDict(poData.items);
                var dictMeta = poData.meta;
                var pluralSelect = _this.makePluralSelectFunction(poData.meta.pluralForms);
                // Everything seems to be OK, assign it all to object members
                _this.dictionary = dictionary;
                _this.dictMeta = dictMeta;
                _this.pluralSelect = pluralSelect;
            }
            catch (e) {
                onError && onError(e);
            }
        });
    };
    // ----------------------------------------------------------------------------------
    // Make key to receive translation from dictionary.
    TranslationController.prototype.getDictKeyForDescriptor = function (descriptor) {
        switch (descriptor.type) {
            case '_t':
                return descriptor.msgid;
            case '_pt':
                return 'ctx:' + descriptor.msgctxt + ';' + descriptor.msgid;
            case '_nt':
                return 'plural:' + descriptor.msgidPlural + ';' + descriptor.msgid;
            case '_npt':
                return 'ctx:' + descriptor.msgctxt + ';' + 'plural:' + descriptor.msgidPlural + ';' + descriptor.msgid;
        }
    };
    // Make key to fill disctionary with translations. 
    // This should be fully compatible with getDictKeyForDescriptor!
    TranslationController.prototype.getDictKeyForEntry = function (item) {
        switch (item.type) {
            case 'single':
                if (item.context) {
                    return 'ctx:' + item.context + ';' + item.entry;
                }
                return item.entry;
            case 'plural':
                if (item.context) {
                    return 'ctx:' + item.context + ';' + 'plural:' + item.entry[1] + ';' + item.entry[0];
                }
                return 'plural:' + item.entry[1] + ';' + item.entry[0];
        }
    };
    // Get msgid/msgid_plural as fallback in case of untranslated string
    TranslationController.prototype.getUntranslatedFallback = function (descriptor) {
        switch (descriptor.type) {
            case '_t':
            case '_pt':
                return [descriptor.msgid];
            case '_nt':
            case '_npt':
                return [descriptor.msgid, descriptor.msgidPlural];
        }
    };
    // Select proper plural form based on descriptor
    TranslationController.prototype.selectPluralForm = function (forms, descriptor) {
        switch (descriptor.type) {
            case '_t':
            case '_pt':
                return forms[0];
            case '_nt':
            case '_npt':
                if (!this.pluralSelect && !this.defaultPluralSelect) {
                    throw new Error('Plural form selection formula not found, but plural form requested in sources');
                }
                var formIndex = this.pluralSelect
                    ? this.pluralSelect(descriptor.factor)
                    : this.defaultPluralSelect(descriptor.factor);
                return forms[formIndex];
        }
    };
    // Substitute parameters to %1, %2, etc and %% placeholders
    TranslationController.prototype.substituteStrings = function (str, descriptor) {
        var tmpStr = str;
        // substitute optional parameters
        descriptor.substitutions.forEach(function (value, index) {
            tmpStr = tmpStr.replace(new RegExp('%' + (index + 1), 'ig'), value.toString());
        });
        // substitute plurality factor
        if (descriptor.type === '_nt' || descriptor.type === '_npt') {
            tmpStr = tmpStr.replace(/%%/gi, descriptor.factor.toString());
        }
        // error handling
        if (this.onFailedSubstitution && tmpStr.match(/%\d+/)) {
            this.onFailedSubstitution(str, descriptor.substitutions);
        }
        return tmpStr;
    };
    // Prepare internal dictionary.
    // This should be run once on translation load.
    TranslationController.prototype.makeNewDict = function (items) {
        var dict = {};
        for (var _i = 0, items_1 = items; _i < items_1.length; _i++) {
            var item = items_1[_i];
            dict[this.getDictKeyForEntry(item)] = item.type === 'single' ? [item.translation] : item.translations;
        }
        return dict;
    };
    // Evaluate Plural-Forms meta header to make plural selection function.
    // This should be run once on translation load.
    TranslationController.prototype.makePluralSelectFunction = function (selectStr) {
        var matches = selectStr.match(/nplurals=(\d+);\s*plural=(.*)/i);
        if (!matches) {
            throw new Error("Couldn't parse Plural-Forms meta header");
        }
        return (new Function('n', 'return ' + matches[2]));
    };
    return TranslationController;
}());
exports.TranslationController = TranslationController;
;
