import { TranslationController } from '../src/controller';
import { I18NEntry } from 'i18n-proto';
import {
  Descriptor,
  PluralDescriptor,
  PoData,
  Meta
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
