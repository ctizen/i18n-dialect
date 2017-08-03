import {
  SimpleTranslation,
  ContextualTranslation,
  PluralTranslation,
  PluralContextualTranslation
} from './src/types';
import { TranslationController } from './src/controller';
export { TranslationController } from './src/controller';

export const _t: (ctrl: TranslationController) => SimpleTranslation =
  (ctrl) => (str, substitutions = [], macroParams = {}): string => {
    return '';
  };

export const _pt: (ctrl: TranslationController) => ContextualTranslation =
  (ctrl) => (context, str, substitutions = [], macroParams = {}): string => {
    return '';
  };

export const _nt: (ctrl: TranslationController) => PluralTranslation =
  (ctrl) => (plurals, factor, substitutions = [], macroParams = {}): string => {
    return '';
  };

export const _npt: (ctrl: TranslationController) => PluralContextualTranslation =
  (ctrl) => (context, plurals, factor, substitutions = [], macroParams = {}): string => {
    return '';
  };

export class TranslationProvider {
  constructor(private ctrl: TranslationController) { }
  public _t: SimpleTranslation = _t(this.ctrl);
  public _pt: ContextualTranslation = _pt(this.ctrl);
  public _nt: PluralTranslation = _nt(this.ctrl);
  public _npt: PluralContextualTranslation = _npt(this.ctrl);
}
