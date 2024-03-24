import { TranslationController } from '../src/controller';
import { I18NEntry } from 'i18n-proto';
import { Descriptor } from '../src/types';
export declare class TranslationControllerTestable extends TranslationController {
    mDictMeta: () => import("i18n-proto").TranslationMeta | undefined;
    mPluralSelect: () => (factor: number) => number | undefined;
    mDictionary: () => {
        [key: string]: string[];
    };
    pGetDictKeyForDescriptor: (descriptor: Descriptor) => string | undefined;
    pGetDictKeyForEntry: (item: I18NEntry) => string | undefined;
    pGetUntranslatedFallback: (descriptor: Descriptor) => string[];
    pSelectPluralForm: (forms: string[], descriptor: Descriptor, forceUntranslated: boolean) => string;
    pSubstituteStrings: (str: string, descriptor: Descriptor) => string;
    pMakeNewDict: (items: I18NEntry[]) => {
        [key: string]: string[];
    };
    pMakePluralSelectFunction: (selectStr: string) => (factor: number) => number;
}
export declare function getFailedSubstitutions(): any[];
export declare function clearFailedSubstitutions(): void;
export declare function setTranslationGetter(getter: (name: string, onReady: (name: string, contents: string) => void) => void): void;
export declare function getController(): TranslationControllerTestable;
