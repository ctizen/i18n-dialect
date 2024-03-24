"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TranslationProvider = exports._npggGen = exports._nggGen = exports._pggGen = exports._ggGen = exports._nptGen = exports._ntGen = exports._ptGen = exports._tGen = exports.TranslationController = void 0;
var controller_1 = require("./src/controller");
Object.defineProperty(exports, "TranslationController", { enumerable: true, get: function () { return controller_1.TranslationController; } });
var _tGen = function (ctrl) { return function (str, substitutions) {
    if (substitutions === void 0) { substitutions = []; }
    return ctrl.getString({
        type: '_t',
        msgid: str,
        msgstr: '', // just for type conformity
        substitutions: substitutions
    });
}; };
exports._tGen = _tGen;
var _ptGen = function (ctrl) { return function (context, str, substitutions) {
    if (substitutions === void 0) { substitutions = []; }
    return ctrl.getString({
        type: '_pt',
        msgid: str,
        msgstr: '', // just for type conformity
        msgctxt: context,
        substitutions: substitutions
    });
}; };
exports._ptGen = _ptGen;
var _ntGen = function (ctrl) { return function (plurals, factor, substitutions) {
    if (substitutions === void 0) { substitutions = []; }
    return ctrl.getString({
        type: '_nt',
        factor: factor,
        msgid: plurals[0],
        msgidPlural: plurals[plurals.length - 1],
        allPlurals: plurals,
        msgstr: [], // just for type conformity
        substitutions: substitutions
    });
}; };
exports._ntGen = _ntGen;
var _nptGen = function (ctrl) { return function (context, plurals, factor, substitutions) {
    if (substitutions === void 0) { substitutions = []; }
    return ctrl.getString({
        type: '_npt',
        factor: factor,
        msgid: plurals[0],
        msgidPlural: plurals[plurals.length - 1],
        allPlurals: plurals,
        msgstr: [], // just for type conformity
        msgctxt: context,
        substitutions: substitutions
    });
}; };
exports._nptGen = _nptGen;
var _ggGen = function (ctrl) { return function (str, substitutions) {
    if (substitutions === void 0) { substitutions = []; }
    return ctrl.getString({
        type: '_t',
        msgid: str,
        msgstr: '', // just for type conformity
        substitutions: substitutions
    }, /* forceUntranslated = */ true);
}; };
exports._ggGen = _ggGen;
var _pggGen = function (ctrl) { return function (context, str, substitutions) {
    if (substitutions === void 0) { substitutions = []; }
    return ctrl.getString({
        type: '_pt',
        msgid: str,
        msgstr: '', // just for type conformity
        msgctxt: context,
        substitutions: substitutions
    }, /* forceUntranslated = */ true);
}; };
exports._pggGen = _pggGen;
var _nggGen = function (ctrl) { return function (plurals, factor, substitutions) {
    if (substitutions === void 0) { substitutions = []; }
    return ctrl.getString({
        type: '_nt',
        factor: factor,
        msgid: plurals[0],
        msgidPlural: plurals[plurals.length - 1],
        allPlurals: plurals,
        msgstr: [], // just for type conformity
        substitutions: substitutions
    }, /* forceUntranslated = */ true);
}; };
exports._nggGen = _nggGen;
var _npggGen = function (ctrl) { return function (context, plurals, factor, substitutions) {
    if (substitutions === void 0) { substitutions = []; }
    return ctrl.getString({
        type: '_npt',
        factor: factor,
        msgid: plurals[0],
        msgidPlural: plurals[plurals.length - 1],
        allPlurals: plurals,
        msgstr: [], // just for type conformity
        msgctxt: context,
        substitutions: substitutions
    }, /* forceUntranslated = */ true);
}; };
exports._npggGen = _npggGen;
var TranslationProvider = /** @class */ (function () {
    function TranslationProvider(ctrl) {
        this.ctrl = ctrl;
        this._t = (0, exports._tGen)(this.ctrl);
        this._pt = (0, exports._ptGen)(this.ctrl);
        this._nt = (0, exports._ntGen)(this.ctrl);
        this._npt = (0, exports._nptGen)(this.ctrl);
        this._gg = (0, exports._ggGen)(this.ctrl);
        this._pgg = (0, exports._pggGen)(this.ctrl);
        this._ngg = (0, exports._nggGen)(this.ctrl);
        this._npgg = (0, exports._npggGen)(this.ctrl);
    }
    return TranslationProvider;
}());
exports.TranslationProvider = TranslationProvider;
//# sourceMappingURL=index.js.map