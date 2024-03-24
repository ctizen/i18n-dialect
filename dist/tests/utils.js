"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getController = exports.setTranslationGetter = exports.clearFailedSubstitutions = exports.getFailedSubstitutions = exports.TranslationControllerTestable = void 0;
var tslib_1 = require("tslib");
var controller_1 = require("../src/controller");
var TranslationControllerTestable = /** @class */ (function (_super) {
    tslib_1.__extends(TranslationControllerTestable, _super);
    function TranslationControllerTestable() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        // prefix 'm' for 'exposed member'
        _this.mDictMeta = function () { return _this.dictMeta; };
        _this.mPluralSelect = function () { return _this.pluralSelect; };
        _this.mDictionary = function () { return _this.dictionary; };
        // prefix 'p' for 'exposed protected'
        _this.pGetDictKeyForDescriptor = function (descriptor) { return _this.getDictKeyForDescriptor(descriptor); };
        _this.pGetDictKeyForEntry = function (item) { return _this.getDictKeyForEntry(item); };
        _this.pGetUntranslatedFallback = function (descriptor) { return _this.getUntranslatedFallback(descriptor); };
        _this.pSelectPluralForm = function (forms, descriptor, forceUntranslated) { return _this.selectPluralForm(forms, descriptor, forceUntranslated); };
        _this.pSubstituteStrings = function (str, descriptor) { return _this.substituteStrings(str, descriptor); };
        _this.pMakeNewDict = function (items) { return _this.makeNewDict(items); };
        _this.pMakePluralSelectFunction = function (selectStr) { return _this.makePluralSelectFunction(selectStr); };
        return _this;
    }
    return TranslationControllerTestable;
}(controller_1.TranslationController));
exports.TranslationControllerTestable = TranslationControllerTestable;
// helpers
var failedSubstitutions = [];
var translationGetter = function (name, onReady) { return onReady(name, ''); };
function getFailedSubstitutions() {
    return failedSubstitutions;
}
exports.getFailedSubstitutions = getFailedSubstitutions;
function clearFailedSubstitutions() {
    failedSubstitutions = [];
}
exports.clearFailedSubstitutions = clearFailedSubstitutions;
function setTranslationGetter(getter) {
    translationGetter = getter;
}
exports.setTranslationGetter = setTranslationGetter;
function getController() {
    return new TranslationControllerTestable(translationGetter, function (str, substitutions) { failedSubstitutions.push({ str: str, substitutions: substitutions }); }, 
    // russian default plural selector
    function (n) { return n % 10 == 1 && n % 100 != 11 ? 0 : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2; });
}
exports.getController = getController;
//# sourceMappingURL=utils.js.map