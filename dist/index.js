"use strict";
exports.__esModule = true;
var controller_1 = require("./src/controller");
exports.TranslationController = controller_1.TranslationController;
exports._tGen = function (ctrl) { return function (str, substitutions) {
    if (substitutions === void 0) { substitutions = []; }
    return ctrl.getString({
        type: '_t',
        msgid: str,
        msgstr: '',
        substitutions: substitutions
    });
}; };
exports._ptGen = function (ctrl) { return function (context, str, substitutions) {
    if (substitutions === void 0) { substitutions = []; }
    return ctrl.getString({
        type: '_pt',
        msgid: str,
        msgstr: '',
        msgctxt: context,
        substitutions: substitutions
    });
}; };
exports._ntGen = function (ctrl) { return function (plurals, factor, substitutions) {
    if (substitutions === void 0) { substitutions = []; }
    return ctrl.getString({
        type: '_nt',
        factor: factor,
        msgid: plurals[0],
        msgidPlural: plurals[plurals.length - 1],
        allPlurals: plurals,
        msgstr: [],
        substitutions: substitutions
    });
}; };
exports._nptGen = function (ctrl) { return function (context, plurals, factor, substitutions) {
    if (substitutions === void 0) { substitutions = []; }
    return ctrl.getString({
        type: '_npt',
        factor: factor,
        msgid: plurals[0],
        msgidPlural: plurals[plurals.length - 1],
        allPlurals: plurals,
        msgstr: [],
        msgctxt: context,
        substitutions: substitutions
    });
}; };
exports._ggGen = function (ctrl) { return function (str, substitutions) {
    if (substitutions === void 0) { substitutions = []; }
    return ctrl.getString({
        type: '_t',
        msgid: str,
        msgstr: '',
        substitutions: substitutions
    }, /* forceUntranslated = */ true);
}; };
exports._pggGen = function (ctrl) { return function (context, str, substitutions) {
    if (substitutions === void 0) { substitutions = []; }
    return ctrl.getString({
        type: '_pt',
        msgid: str,
        msgstr: '',
        msgctxt: context,
        substitutions: substitutions
    }, /* forceUntranslated = */ true);
}; };
exports._nggGen = function (ctrl) { return function (plurals, factor, substitutions) {
    if (substitutions === void 0) { substitutions = []; }
    return ctrl.getString({
        type: '_nt',
        factor: factor,
        msgid: plurals[0],
        msgidPlural: plurals[plurals.length - 1],
        allPlurals: plurals,
        msgstr: [],
        substitutions: substitutions
    }, /* forceUntranslated = */ true);
}; };
exports._npggGen = function (ctrl) { return function (context, plurals, factor, substitutions) {
    if (substitutions === void 0) { substitutions = []; }
    return ctrl.getString({
        type: '_npt',
        factor: factor,
        msgid: plurals[0],
        msgidPlural: plurals[plurals.length - 1],
        allPlurals: plurals,
        msgstr: [],
        msgctxt: context,
        substitutions: substitutions
    }, /* forceUntranslated = */ true);
}; };
var TranslationProvider = (function () {
    function TranslationProvider(ctrl) {
        this.ctrl = ctrl;
        this._t = exports._tGen(this.ctrl);
        this._pt = exports._ptGen(this.ctrl);
        this._nt = exports._ntGen(this.ctrl);
        this._npt = exports._nptGen(this.ctrl);
        this._gg = exports._ggGen(this.ctrl);
        this._pgg = exports._pggGen(this.ctrl);
        this._ngg = exports._nggGen(this.ctrl);
        this._npgg = exports._npggGen(this.ctrl);
    }
    return TranslationProvider;
}());
exports.TranslationProvider = TranslationProvider;
