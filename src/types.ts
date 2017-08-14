export {
  SimpleTranslation,
  ContextualTranslation,
  PluralTranslation,
  PluralContextualTranslation
} from 'i18n-stex/src/types';
import { Scalar } from 'i18n-stex/src/types';

export type SingleSimpleDescriptor = {
  type: '_t',
  msgid: string,
  msgstr: string,
  substitutions: Scalar[]
};

export type SingleContextualDescriptor = {
  type: '_pt',
  msgid: string,
  msgstr: string,
  msgctxt: string,
  substitutions: Scalar[]
};

export type PluralSimpleDescriptor = {
  type: '_nt',
  factor: number,
  msgid: string,
  msgidPlural: string,
  allPlurals: string[], // for untranslated fallbacks
  msgstr: string[],
  substitutions: Scalar[]
};

export type PluralContextualDescriptor = {
  type: '_npt',
  factor: number,
  msgid: string,
  msgidPlural: string,
  allPlurals: string[], // for untranslated fallbacks
  msgstr: string[],
  msgctxt: string,
  substitutions: Scalar[]
};

export type SingleDescriptor = SingleSimpleDescriptor | SingleContextualDescriptor;
export type PluralDescriptor = PluralSimpleDescriptor | PluralContextualDescriptor;
export type Descriptor = SingleDescriptor | PluralDescriptor;
