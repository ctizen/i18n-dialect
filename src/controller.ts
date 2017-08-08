import {
  Descriptor,
  PluralDescriptor,
  Macro,
  PoData,
  Meta
} from './types';
import { I18NEntry } from 'i18n-proto';

export class TranslationController {
  protected dictMeta: Meta | undefined;
  protected pluralSelect: (factor: number) => number | undefined;
  protected dictionary: { [key: string]: string[] } = {};
  // Additional hash map for strings that need macroprocessing.
  // Filled when translation is loaded but before it is applied.
  protected stringsRequiringMacroProcessing: { [key: string]: boolean } = {};

  constructor(
    protected translationGetter: (name: string) => Promise<string>,
    protected sharedMacros: { [name: string]: Macro },
    protected onFailedSubstitution: (str: string, substitutions: (string | number)[]) => void | undefined,
    protected onFailedMacro: (str: string) => void | undefined,
    protected defaultPluralSelect: (factor: number) => number,
    // TODO: что-то еще?
  ) { }

  public getString(descriptor: Descriptor): string {
    let key: string | undefined = this.getDictKeyForDescriptor(descriptor);
    let translationForms: string[] = key && this.dictionary[key] || this.getUntranslatedFallback(descriptor);

    let translation = this.selectPluralForm(translationForms, descriptor);

    if (descriptor.substitutions.length > 0) {
      translation = this.substituteStrings(translation, descriptor);
    }

    if (this.stringsRequiringMacroProcessing[key]) {
      translation = this.runMacros(translation, descriptor);
    }

    return translation;
  }

  public setLocale(localeName: string): Promise<string> { // resolves with new locale name when loading is finished
    return new Promise((resolve, reject) => {
      this.translationGetter(localeName)
        .then((value) => {
          let poData: PoData = JSON.parse(value); // TODO: better json schema validation
          if (!poData.items || !poData.meta) {
            throw new Error('Invalid format of translation file');
          }

          let dictionary = this.makeNewDict(poData.items);
          let stringsRequiringMacroProcessing = this.detectMacroStrings(dictionary);
          let dictMeta = poData.meta;
          let pluralSelect = this.makePluralSelectFunction(poData.meta.pluralForms);

          // Everything seems to be OK, assign it all to object members
          this.dictionary = dictionary;
          this.stringsRequiringMacroProcessing = stringsRequiringMacroProcessing;
          this.dictMeta = dictMeta;
          this.pluralSelect = pluralSelect;

          resolve(localeName);
        })
        .catch((e) => reject(e));
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
        return [descriptor.msgid, descriptor.msgidPlural];
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
        return forms[formIndex];
    }
  }

  // Substitute parameters to %1, %2, etc and %% placeholders
  protected substituteStrings(str: string, descriptor: Descriptor): string {
    let tmpStr = str;

    // substitute optional parameters
    descriptor.substitutions.forEach((value, index) => {
      tmpStr = tmpStr.replace('%' + (index + 1), value.toString());
    });

    // substitute plurality factor
    if (descriptor.type === '_nt' || descriptor.type === '_npt') {
      tmpStr = tmpStr.replace('%%', descriptor.factor.toString());
    }

    // error handling
    if (this.onFailedSubstitution && tmpStr.match(/%\d+/)) {
      this.onFailedSubstitution(str, descriptor.substitutions);
    }

    return tmpStr;
  }

  // Run macros and substitute their values to macro placeholders
  protected runMacros(str: string, descriptor: Descriptor): string {
    return str.replace(/%\{(\w+)(.*)\}/i, (foundSubstring, macroName: string, params: string) => {
      // TODO: написать примеры, которые должны работать

      // error handling
      if (this.onFailedMacro) {
        this.onFailedMacro(str);
      }

      return '';
    });
  }

  // Prepare internal dictionary.
  // This should be run once on translation load.
  protected makeNewDict(items: I18NEntry[]): { [key: string]: string[] } {
    let dict: { [key: string]: string[] } = {};
    for (let item of items) {
      dict[this.getDictKeyForEntry(item)] = typeof item.entry === 'string' ? [item.entry] : item.entry;
    }

    return dict;
  }

  // TODO: tests with all forms listed in https://www.gnu.org/software/gettext/manual/html_node/Plural-forms.html#Plural-forms
  // Evaluate Plural-Forms meta header to make plural selection function.
  // This should be run once on translation load.
  protected makePluralSelectFunction(selectStr: string) {
    let matches = selectStr.match(/nplurals=(\d+);\s*plural=(.*)/i);
    if (!matches) {
      throw new Error("Couldn't parse Plural-Forms meta header");
    }
    return (new Function('n', 'return ' + matches[2])) as (factor: number) => number;
  }

  // Get list of all strings containing macro substitutions
  // to speed up string getter in runtime. This should be run
  // once on translation load.
  protected detectMacroStrings(dict: { [key: string]: string[] }): { [key: string]: boolean } {
    let macroStrings: { [key: string]: boolean } = {};
    for (let str in dict) {
      if (dict[str].join(' ').match(/%\{.*?\}/i)) {
        macroStrings[str] = true;
      }
    }

    return macroStrings;
  }
};

