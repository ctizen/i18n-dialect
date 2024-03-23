import {
  SimpleTranslation,
  ContextualTranslation,
  PluralTranslation,
  PluralContextualTranslation
} from './src/types';
import { TranslationController } from './src/controller';
export { TranslationController } from './src/controller';

export const _tGen: (ctrl: TranslationController) => SimpleTranslation =
  (ctrl) => (str: string, substitutions = []): string => {
    return ctrl.getString({
      type: '_t',
      msgid: str,
      msgstr: '', // just for type conformity
      substitutions
    });
  };

export const _ptGen: (ctrl: TranslationController) => ContextualTranslation =
  (ctrl) => (context: string, str: string, substitutions = []): string => {
    return ctrl.getString({
      type: '_pt',
      msgid: str,
      msgstr: '', // just for type conformity
      msgctxt: context,
      substitutions
    });
  };

export const _ntGen: (ctrl: TranslationController) => PluralTranslation =
  (ctrl) => (plurals: string[], factor: number, substitutions = []): string => {
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

export const _nptGen: (ctrl: TranslationController) => PluralContextualTranslation =
  (ctrl) => (context: string, plurals: string[], factor: number, substitutions = []): string => {
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

export const _ggGen: (ctrl: TranslationController) => SimpleTranslation =
  (ctrl) => (str: string, substitutions = []): string => {
    return ctrl.getString({
      type: '_t',
      msgid: str,
      msgstr: '', // just for type conformity
      substitutions
    }, /* forceUntranslated = */ true);
  };

export const _pggGen: (ctrl: TranslationController) => ContextualTranslation =
  (ctrl) => (context: string, str: string, substitutions = []): string => {
    return ctrl.getString({
      type: '_pt',
      msgid: str,
      msgstr: '', // just for type conformity
      msgctxt: context,
      substitutions
    }, /* forceUntranslated = */ true);
  };

export const _nggGen: (ctrl: TranslationController) => PluralTranslation =
  (ctrl) => (plurals: string[], factor: number, substitutions = []): string => {
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

export const _npggGen: (ctrl: TranslationController) => PluralContextualTranslation =
  (ctrl) => (context: string, plurals: string[], factor: number, substitutions = []): string => {
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
  constructor(private readonly ctrl: TranslationController) { }
  public _t: SimpleTranslation = _tGen(this.ctrl);
  public _pt: ContextualTranslation = _ptGen(this.ctrl);
  public _nt: PluralTranslation = _ntGen(this.ctrl);
  public _npt: PluralContextualTranslation = _nptGen(this.ctrl);
  public _gg: SimpleTranslation = _ggGen(this.ctrl);
  public _pgg: ContextualTranslation = _pggGen(this.ctrl);
  public _ngg: PluralTranslation = _nggGen(this.ctrl);
  public _npgg: PluralContextualTranslation = _npggGen(this.ctrl);
}
