import { SimpleTranslation, ContextualTranslation, PluralTranslation, PluralContextualTranslation } from './src/types';
import { TranslationController } from './src/controller';
export { TranslationController } from './src/controller';
export declare const _tGen: (ctrl: TranslationController) => SimpleTranslation;
export declare const _ptGen: (ctrl: TranslationController) => ContextualTranslation;
export declare const _ntGen: (ctrl: TranslationController) => PluralTranslation;
export declare const _nptGen: (ctrl: TranslationController) => PluralContextualTranslation;
export declare const _ggGen: (ctrl: TranslationController) => SimpleTranslation;
export declare const _pggGen: (ctrl: TranslationController) => ContextualTranslation;
export declare const _nggGen: (ctrl: TranslationController) => PluralTranslation;
export declare const _npggGen: (ctrl: TranslationController) => PluralContextualTranslation;
export declare class TranslationProvider {
    private readonly ctrl;
    constructor(ctrl: TranslationController);
    _t: SimpleTranslation;
    _pt: ContextualTranslation;
    _nt: PluralTranslation;
    _npt: PluralContextualTranslation;
    _gg: SimpleTranslation;
    _pgg: ContextualTranslation;
    _ngg: PluralTranslation;
    _npgg: PluralContextualTranslation;
}
