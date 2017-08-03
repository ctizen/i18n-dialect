import { Descriptor, PluralDescriptor, Macro } from './types';

export class TranslationController {
  private dictionary: { [key: string]: string[] };
  // Additional hash map for strings that need macroprocessing.
  // Filled when translation is loaded but before it is applied.
  private stringsRequiringMacroProcessing: { [key: string]: boolean };

  constructor(
    private translationGetter: (name: string) => Promise<string>,
    private sharedMacros: { [name: string]: Macro },
    // TODO: что-то еще?
  ) { }

  getString(descriptor: Descriptor): string {
    let key: string | undefined = this.getDictKey(descriptor);
    let translationForms: string[] = key && this.dictionary[key] || this.getUntranslatedFallback(descriptor);

    let translation: string;
    if (descriptor.type === '_t' || descriptor.type === '_pt') {
      translation = translationForms[0];
    } else {
      translation = this.selectPluralForm(translationForms, descriptor);
    }

    if (descriptor.substitutions.length > 0) {
      translation = this.substituteStrings(translation, descriptor);
    }

    if (this.stringsRequiringMacroProcessing[key]) {
      translation = this.runMacros(translation, descriptor);
    }

    return translation;
  }

  protected getDictKey(descriptor: Descriptor): string | undefined {

  }

  protected getUntranslatedFallback(descriptor: Descriptor): string[] {

  }

  protected selectPluralForm(forms: string[], descriptor: PluralDescriptor): string {

  }

  protected substituteStrings(str: string, descriptor: Descriptor): string {

  }

  protected runMacros(str: string, descriptor: Descriptor): string {

  }

  setLocale(localeName: string): Promise<string> { // resolves when loading is finished
    return Promise.resolve(''); // TODO
  }
};
