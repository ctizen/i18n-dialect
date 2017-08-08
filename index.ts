import {
  SimpleTranslation,
  ContextualTranslation,
  PluralTranslation,
  PluralContextualTranslation
} from './src/types';
import { TranslationController } from './src/controller';
export { TranslationController } from './src/controller';

export const _t: (ctrl: TranslationController) => SimpleTranslation =
  (ctrl) => (str, substitutions = []): string => {
    return ctrl.getString({
      type: '_t',
      msgid: str,
      msgstr: '', // just for type conformity
      substitutions
    });
  };

export const _pt: (ctrl: TranslationController) => ContextualTranslation =
  (ctrl) => (context, str, substitutions = []): string => {
    return ctrl.getString({
      type: '_pt',
      msgid: str,
      msgstr: '', // just for type conformity
      msgctxt: context,
      substitutions
    });
  };

export const _nt: (ctrl: TranslationController) => PluralTranslation =
  (ctrl) => (plurals, factor, substitutions = []): string => {
    return ctrl.getString({
      type: '_nt',
      factor,
      msgid: plurals[0],
      msgidPlural: plurals[1],
      msgstr: [], // just for type conformity
      substitutions
    });
  };

export const _npt: (ctrl: TranslationController) => PluralContextualTranslation =
  (ctrl) => (context, plurals, factor, substitutions = []): string => {
    return ctrl.getString({
      type: '_npt',
      factor,
      msgid: plurals[0],
      msgidPlural: plurals[1],
      msgstr: [], // just for type conformity
      msgctxt: context,
      substitutions
    });
  };

export class TranslationProvider {
  constructor(private ctrl: TranslationController) { }
  public _t: SimpleTranslation = _t(this.ctrl);
  public _pt: ContextualTranslation = _pt(this.ctrl);
  public _nt: PluralTranslation = _nt(this.ctrl);
  public _npt: PluralContextualTranslation = _npt(this.ctrl);
}
