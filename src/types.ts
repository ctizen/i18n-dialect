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
  substitutions: Scalar[],
  macros: { [key: string]: Macro }
};

export type SingleContextualDescriptor = {
  type: '_pt',
  msgid: string,
  msgstr: string,
  msgctxt: string,
  substitutions: Scalar[],
  macros: { [key: string]: Macro }
};

export type PluralSimpleDescriptor = {
  type: '_nt',
  factor: number,
  msgid: string,
  msgidPlural: string,
  msgstr: string[],
  substitutions: Scalar[],
  macros: { [key: string]: Macro }
};

export type PluralContextualDescriptor = {
  type: '_npt',
  factor: number,
  msgid: string,
  msgidPlural: string,
  msgstr: string[],
  msgctxt: string,
  substitutions: Scalar[],
  macros: { [key: string]: Macro }
};

export type SingleDescriptor = SingleSimpleDescriptor | SingleContextualDescriptor;
export type PluralDescriptor = PluralSimpleDescriptor | PluralContextualDescriptor;
export type Descriptor = SingleDescriptor | PluralDescriptor;

import { VNode } from 'preact'; // import something to just get typings...
// TODO: сомнительно, завязываемся на конкретную реализацию. МБ дженериков навернуть?
export type Macro = (name: string, params: any[]) => string | JSX.Element;
