import {
  Descriptor,
  PluralDescriptor
} from './types';
import { I18NEntry, TranslationJson, TranslationMeta } from 'i18n-proto';

export class TranslationController {
  protected dictMeta: TranslationMeta | undefined;
  protected pluralSelect: (factor: number) => number | undefined;
  protected dictionary: { [key: string]: string[] } = {};

  constructor(
    protected translationGetter: (name: string, onReady: (name: string, contents: string) => void) => void,
    protected onFailedSubstitution: (str: string, substitutions: (string | number)[]) => void | undefined,
    protected defaultPluralSelect: (factor: number) => number
  ) { }

  public getString(descriptor: Descriptor, forceUntranslated: boolean = false): string {
    let key: string | undefined = forceUntranslated ? undefined : this.getDictKeyForDescriptor(descriptor);
    let translationForms: string[] = key && this.dictionary[key] || this.getUntranslatedFallback(descriptor);
    let translation = this.selectPluralForm(translationForms, descriptor);
    return this.substituteStrings(translation, descriptor);
  }

  public setLocale(
    localeName: string,
    onReady: (name: string) => void, // called with new locale name when loading is finished
    onError?: (e: any) => void
  ): void {
    this.translationGetter(localeName, (name: string, contents: string) => {
      let poData: TranslationJson = JSON.parse(contents); // TODO: better json schema validation?
      if (!poData.items || !poData.meta) {
        onError && onError('Invalid format of translation file');
        return;
      }

      try {
        let dictionary = this.makeNewDict(poData.items);
        let dictMeta = poData.meta;
        let pluralSelect = this.makePluralSelectFunction(poData.meta.pluralForms);

        // Everything seems to be OK, assign it all to object members
        this.dictionary = dictionary;
        this.dictMeta = dictMeta;
        this.pluralSelect = pluralSelect;
        onReady(localeName);
      } catch (e) {
        onError && onError(e);
      }
    });
  }

  // ----------------------------------------------------------------------------------

  // Make key to receive translation from dictionary.
  protected getDictKeyForDescriptor(descriptor: Descriptor): string | undefined {
    switch (descriptor.type) {
      case '_t':
        return descriptor.msgid;
      case '_pt':
        return 'ctx:' + descriptor.msgctxt + ';' + descriptor.msgid;
      case '_nt':
        return 'plural:' + descriptor.msgidPlural + ';' + descriptor.msgid;
      case '_npt':
        return 'ctx:' + descriptor.msgctxt + ';' + 'plural:' + descriptor.msgidPlural + ';' + descriptor.msgid;
    }
  }


  // Make key to fill disctionary with translations. 
  // This should be fully compatible with getDictKeyForDescriptor!
  protected getDictKeyForEntry(item: I18NEntry): string | undefined {
    switch (item.type) {
      case 'single':
        if (item.context) {
          return 'ctx:' + item.context + ';' + item.entry;
        }
        return item.entry;
      case 'plural':
        if (item.context) {
          return 'ctx:' + item.context + ';' + 'plural:' + item.entry[1] + ';' + item.entry[0];
        }
        return 'plural:' + item.entry[1] + ';' + item.entry[0];
    }
  }

  // Get msgid/msgid_plural as fallback in case of untranslated string
  protected getUntranslatedFallback(descriptor: Descriptor): string[] {
    switch (descriptor.type) {
      case '_t':
      case '_pt':
        return [descriptor.msgid];
      case '_nt':
      case '_npt':
        return descriptor.allPlurals;
    }
  }

  // Select proper plural form based on descriptor
  protected selectPluralForm(forms: string[], descriptor: Descriptor): string {
    switch (descriptor.type) {
      case '_t':
      case '_pt':
        return forms[0];
      case '_nt':
      case '_npt':
        if (!this.pluralSelect && !this.defaultPluralSelect) {
          throw new Error('Plural form selection formula not found, but plural form requested in sources');
        }
        let formIndex = this.pluralSelect
          ? this.pluralSelect(descriptor.factor)
          : this.defaultPluralSelect(descriptor.factor);
        return forms[formIndex + 0]; // explicit cast to number; some gettext formulas may return just true/false - that's bad.
    }
  }

  // Substitute parameters to %1, %2, etc and %% placeholders
  protected substituteStrings(str: string, descriptor: Descriptor): string {
    let tmpStr = str;

    // substitute optional parameters
    descriptor.substitutions.forEach((value, index) => {
      tmpStr = tmpStr.replace(new RegExp('%' + (index + 1), 'ig'), value.toString());
    });

    // substitute plurality factor
    if (descriptor.type === '_nt' || descriptor.type === '_npt') {
      tmpStr = tmpStr.replace(/%%/gi, descriptor.factor.toString());
    }

    // error handling
    if (this.onFailedSubstitution && tmpStr.match(/%\d+/)) {
      this.onFailedSubstitution(str, descriptor.substitutions);
    }

    return tmpStr;
  }

  // Prepare internal dictionary.
  // This should be run once on translation load.
  protected makeNewDict(items: I18NEntry[]): { [key: string]: string[] } {
    let dict: { [key: string]: string[] } = {};
    for (let item of items) {
      dict[this.getDictKeyForEntry(item)] = item.type === 'single' ? [item.translation] : item.translations;
    }

    return dict;
  }

  // Evaluate Plural-Forms meta header to make plural selection function.
  // This should be run once on translation load.
  protected makePluralSelectFunction(selectStr: string) {
    let matches = selectStr.match(/nplurals=(\d+);\s*plural=(.*)/i);
    if (!matches) {
      throw new Error("Couldn't parse Plural-Forms meta header");
    }
    return (new Function('n', 'return ' + matches[2])) as (factor: number) => number;
  }
};

