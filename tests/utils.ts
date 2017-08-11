import { TranslationController } from '../src/controller';
import { I18NEntry } from 'i18n-proto';
import {
  Descriptor,
  PluralDescriptor
} from '../src/types';

export class TranslationControllerTestable extends TranslationController {
  // prefix 'm' for 'exposed member'
  public mDictMeta = () => this.dictMeta;
  public mPluralSelect = () => this.pluralSelect;
  public mDictionary = () => this.dictionary;

  // prefix 'p' for 'exposed protected'
  public pGetDictKeyForDescriptor = (descriptor: Descriptor) => this.getDictKeyForDescriptor(descriptor);
  public pGetDictKeyForEntry = (item: I18NEntry) => this.getDictKeyForEntry(item);
  public pGetUntranslatedFallback = (descriptor: Descriptor) => this.getUntranslatedFallback(descriptor);
  public pSelectPluralForm = (forms: string[], descriptor: Descriptor) => this.selectPluralForm(forms, descriptor);
  public pSubstituteStrings = (str: string, descriptor: Descriptor) => this.substituteStrings(str, descriptor);
  public pMakeNewDict = (items: I18NEntry[]) => this.makeNewDict(items);
  public pMakePluralSelectFunction = (selectStr: string) => this.makePluralSelectFunction(selectStr);
}

// helpers

let failedSubstitutions = [];
let translationGetter = (name: string, onReady: (name: string, contents: string) => void) => onReady(name, '');

export function getFailedSubstitutions() {
  return failedSubstitutions;
}

export function clearFailedSubstitutions() {
  failedSubstitutions = [];
}

export function setTranslationGetter(getter: (name: string, onReady: (name: string, contents: string) => void) => void) {
  translationGetter = getter;
}

export function getController() {
  return new TranslationControllerTestable(
    translationGetter,
    (str, substitutions) => failedSubstitutions.push({ str, substitutions }),
    // russian default plural selector
    (n) => n % 10 == 1 && n % 100 != 11 ? 0 : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2
  );
}
