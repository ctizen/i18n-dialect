export { TranslationController } from './src/controller';
export const _tGen = (ctrl) => (str, substitutions = []) => {
    return ctrl.getString({
        type: '_t',
        msgid: str,
        msgstr: '', // just for type conformity
        substitutions
    });
};
export const _ptGen = (ctrl) => (context, str, substitutions = []) => {
    return ctrl.getString({
        type: '_pt',
        msgid: str,
        msgstr: '', // just for type conformity
        msgctxt: context,
        substitutions
    });
};
export const _ntGen = (ctrl) => (plurals, factor, substitutions = []) => {
    return ctrl.getString({
        type: '_nt',
        factor,
        msgid: plurals[0],
        msgidPlural: plurals[plurals.length - 1],
        allPlurals: plurals,
        msgstr: [], // just for type conformity
        substitutions
    });
};
export const _nptGen = (ctrl) => (context, plurals, factor, substitutions = []) => {
    return ctrl.getString({
        type: '_npt',
        factor,
        msgid: plurals[0],
        msgidPlural: plurals[plurals.length - 1],
        allPlurals: plurals,
        msgstr: [], // just for type conformity
        msgctxt: context,
        substitutions
    });
};
export const _ggGen = (ctrl) => (str, substitutions = []) => {
    return ctrl.getString({
        type: '_t',
        msgid: str,
        msgstr: '', // just for type conformity
        substitutions
    }, /* forceUntranslated = */ true);
};
export const _pggGen = (ctrl) => (context, str, substitutions = []) => {
    return ctrl.getString({
        type: '_pt',
        msgid: str,
        msgstr: '', // just for type conformity
        msgctxt: context,
        substitutions
    }, /* forceUntranslated = */ true);
};
export const _nggGen = (ctrl) => (plurals, factor, substitutions = []) => {
    return ctrl.getString({
        type: '_nt',
        factor,
        msgid: plurals[0],
        msgidPlural: plurals[plurals.length - 1],
        allPlurals: plurals,
        msgstr: [], // just for type conformity
        substitutions
    }, /* forceUntranslated = */ true);
};
export const _npggGen = (ctrl) => (context, plurals, factor, substitutions = []) => {
    return ctrl.getString({
        type: '_npt',
        factor,
        msgid: plurals[0],
        msgidPlural: plurals[plurals.length - 1],
        allPlurals: plurals,
        msgstr: [], // just for type conformity
        msgctxt: context,
        substitutions
    }, /* forceUntranslated = */ true);
};
export class TranslationProvider {
    constructor(ctrl) {
        this.ctrl = ctrl;
        this._t = _tGen(this.ctrl);
        this._pt = _ptGen(this.ctrl);
        this._nt = _ntGen(this.ctrl);
        this._npt = _nptGen(this.ctrl);
        this._gg = _ggGen(this.ctrl);
        this._pgg = _pggGen(this.ctrl);
        this._ngg = _nggGen(this.ctrl);
        this._npgg = _npggGen(this.ctrl);
    }
}
//# sourceMappingURL=index.js.map