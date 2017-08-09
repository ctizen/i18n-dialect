"use strict";
exports.__esModule = true;
var controller_1 = require("./src/controller");
exports.TranslationController = controller_1.TranslationController;
exports._t = function (ctrl) { return function (str, substitutions) {
    if (substitutions === void 0) { substitutions = []; }
    return ctrl.getString({
        type: '_t',
        msgid: str,
        msgstr: '',
        substitutions: substitutions
    });
}; };
exports._pt = function (ctrl) { return function (context, str, substitutions) {
    if (substitutions === void 0) { substitutions = []; }
    return ctrl.getString({
        type: '_pt',
        msgid: str,
        msgstr: '',
        msgctxt: context,
        substitutions: substitutions
    });
}; };
exports._nt = function (ctrl) { return function (plurals, factor, substitutions) {
    if (substitutions === void 0) { substitutions = []; }
    return ctrl.getString({
        type: '_nt',
        factor: factor,
        msgid: plurals[0],
        msgidPlural: plurals[1],
        msgstr: [],
        substitutions: substitutions
    });
}; };
exports._npt = function (ctrl) { return function (context, plurals, factor, substitutions) {
    if (substitutions === void 0) { substitutions = []; }
    return ctrl.getString({
        type: '_npt',
        factor: factor,
        msgid: plurals[0],
        msgidPlural: plurals[1],
        msgstr: [],
        msgctxt: context,
        substitutions: substitutions
    });
}; };
var TranslationProvider = (function () {
    function TranslationProvider(ctrl) {
        this.ctrl = ctrl;
        this._t = exports._t(this.ctrl);
        this._pt = exports._pt(this.ctrl);
        this._nt = exports._nt(this.ctrl);
        this._npt = exports._npt(this.ctrl);
    }
    return TranslationProvider;
}());
exports.TranslationProvider = TranslationProvider;
