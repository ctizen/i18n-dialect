import { TranslationController } from '../src/controller';
export class TranslationControllerTestable extends TranslationController {
    constructor() {
        super(...arguments);
        // prefix 'm' for 'exposed member'
        this.mDictMeta = () => this.dictMeta;
        this.mPluralSelect = () => this.pluralSelect;
        this.mDictionary = () => this.dictionary;
        // prefix 'p' for 'exposed protected'
        this.pGetDictKeyForDescriptor = (descriptor) => this.getDictKeyForDescriptor(descriptor);
        this.pGetDictKeyForEntry = (item) => this.getDictKeyForEntry(item);
        this.pGetUntranslatedFallback = (descriptor) => this.getUntranslatedFallback(descriptor);
        this.pSelectPluralForm = (forms, descriptor, forceUntranslated) => this.selectPluralForm(forms, descriptor, forceUntranslated);
        this.pSubstituteStrings = (str, descriptor) => this.substituteStrings(str, descriptor);
        this.pMakeNewDict = (items) => this.makeNewDict(items);
        this.pMakePluralSelectFunction = (selectStr) => this.makePluralSelectFunction(selectStr);
    }
}
// helpers
let failedSubstitutions = [];
let translationGetter = (name, onReady) => onReady(name, '');
export function getFailedSubstitutions() {
    return failedSubstitutions;
}
export function clearFailedSubstitutions() {
    failedSubstitutions = [];
}
export function setTranslationGetter(getter) {
    translationGetter = getter;
}
export function getController() {
    return new TranslationControllerTestable(translationGetter, (str, substitutions) => { failedSubstitutions.push({ str, substitutions }); }, 
    // russian default plural selector
    (n) => n % 10 == 1 && n % 100 != 11 ? 0 : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2);
}
//# sourceMappingURL=utils.js.map