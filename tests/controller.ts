import * as assert from 'assert';
import { PluralI18NEntry, SingleI18NEntry } from 'i18n-proto';
import { Descriptor } from '../src/types';
import { I18NEntry } from 'i18n-proto';
import {
  TranslationControllerTestable,
  getController,
  getFailedSubstitutions,
  clearFailedSubstitutions,
  setTranslationGetter
} from './utils';
import { testLocaleJson } from './fixture';

describe('I18n end-user library', () => {
  beforeEach(() => clearFailedSubstitutions());

  // Note: these compatibility tests are very important to guarantee
  // that dictionary keys are formed in same way for i18n entries and descriptors.

  it('Compatibility: getDictKeyForEntry and getDictKeyForDescriptor values are compatible for _t', () => {
    let t = getController();
    let entry: SingleI18NEntry = {
      type: 'single',
      entry: 'test'
    };
    let descr: Descriptor = {
      type: '_t',
      msgid: 'test',
      msgstr: '',
      substitutions: []
    };
    assert.equal(
      t.pGetDictKeyForDescriptor(descr),
      t.pGetDictKeyForEntry(entry)
    );
  });

  it('Compatibility: getDictKeyForEntry and getDictKeyForDescriptor values are compatible for _pt', () => {
    let t = getController();
    let entry: SingleI18NEntry = {
      type: 'single',
      entry: 'test',
      context: 'ctx'
    };
    let descr: Descriptor = {
      type: '_pt',
      msgid: 'test',
      msgstr: '',
      msgctxt: 'ctx',
      substitutions: []
    };
    assert.equal(
      t.pGetDictKeyForDescriptor(descr),
      t.pGetDictKeyForEntry(entry)
    );
  });

  it('Compatibility: getDictKeyForEntry and getDictKeyForDescriptor values are compatible for _nt', () => {
    let t = getController();
    let entry: PluralI18NEntry = {
      type: 'plural',
      entry: ['test1', 'test3'],
      translations: []
    };
    let descr: Descriptor = {
      type: '_nt',
      factor: 2,
      msgid: 'test1',
      msgidPlural: 'test3',
      allPlurals: ['test1', 'test2', 'test3'],
      msgstr: [],
      substitutions: []
    };
    assert.equal(
      t.pGetDictKeyForDescriptor(descr),
      t.pGetDictKeyForEntry(entry)
    );
  });

  it('Compatibility: getDictKeyForEntry and getDictKeyForDescriptor values are compatible for _npt', () => {
    let t = getController();
    let entry: PluralI18NEntry = {
      type: 'plural',
      entry: ['test1', 'test3'],
      translations: [],
      context: 'ctx'
    };
    let descr: Descriptor = {
      type: '_npt',
      factor: 2,
      msgid: 'test1',
      msgidPlural: 'test3',
      allPlurals: ['test1', 'test2', 'test3'],
      msgctxt: 'ctx',
      msgstr: [],
      substitutions: []
    };
    assert.equal(
      t.pGetDictKeyForDescriptor(descr),
      t.pGetDictKeyForEntry(entry)
    );
  });

  it('Selects proper plural form with selectPluralForm and default selector', () => {
    let t = getController();
    let descr: Descriptor = {
      type: '_nt',
      factor: 2,
      msgid: 'test1', // ignored
      msgidPlural: 'test3', // ignored
      allPlurals: ['test1', 'test2', 'test3'],
      msgstr: [],
      substitutions: []
    };

    // default selector is russian
    assert.equal(
      t.pSelectPluralForm(['одна форма', 'две-четыре формы', 'пять и более форм'], descr),
      'две-четыре формы'
    );
    descr.factor = 1;
    assert.equal(
      t.pSelectPluralForm(['одна форма', 'две-четыре формы', 'пять и более форм'], descr),
      'одна форма'
    );
    descr.factor = 6;
    assert.equal(
      t.pSelectPluralForm(['одна форма', 'две-четыре формы', 'пять и более форм'], descr),
      'пять и более форм'
    );
  });

  it('Selects one and only form with selectPluralForm and default selector, if descriptor is not plural', () => {
    let t = getController();
    let descr: Descriptor = {
      type: '_t',
      msgid: 'test1', // ignored
      msgstr: '',
      substitutions: []
    };

    // default selector is russian
    assert.equal(
      t.pSelectPluralForm(['одна форма'], descr),
      'одна форма'
    );
  });

  it('substituteStrings: proper substitution of single parameter', () => {
    let t = getController();
    let str = 'This str has %1 as a value';
    let descr: Descriptor = {
      type: '_t',
      msgid: 'test1', // ignored
      msgstr: '',
      substitutions: [
        'param1'
      ]
    };

    assert.equal(
      t.pSubstituteStrings(str, descr),
      'This str has param1 as a value'
    );
  });

  it('substituteStrings: proper substitution of single parameter in many places', () => {
    let t = getController();
    let str = 'This str has %1 as a value and %1 once again';
    let descr: Descriptor = {
      type: '_t',
      msgid: 'test1', // ignored
      msgstr: '',
      substitutions: [
        'param1'
      ]
    };

    assert.equal(
      t.pSubstituteStrings(str, descr),
      'This str has param1 as a value and param1 once again'
    );
  });

  it('substituteStrings: proper substitution of multiple different parameters', () => {
    let t = getController();
    let str = 'This str has %1, %2 and %3 as values';
    let descr: Descriptor = {
      type: '_t',
      msgid: 'test1', // ignored
      msgstr: '',
      substitutions: [
        'param1',
        'param2',
        'param3'
      ]
    };

    assert.equal(
      t.pSubstituteStrings(str, descr),
      'This str has param1, param2 and param3 as values'
    );
  });

  it('substituteStrings: proper substitution of multiple different parameters in many places', () => {
    let t = getController();
    let str = 'This str has %1, %2 and %3 as values, and also %1 and %3 as more values';
    let descr: Descriptor = {
      type: '_t',
      msgid: 'test1', // ignored
      msgstr: '',
      substitutions: [
        'param1',
        'param2',
        'param3'
      ]
    };

    assert.equal(
      t.pSubstituteStrings(str, descr),
      'This str has param1, param2 and param3 as values, and also param1 and param3 as more values'
    );
  });

  it('substituteStrings: proper substitution of plurality factor for plural forms', () => {
    let t = getController();
    let str = 'This str has %% plurality factor';
    let descr: Descriptor = {
      type: '_nt',
      factor: 2,
      msgid: 'test1', // ignored
      msgidPlural: 'test3', // ignored
      allPlurals: ['test1', 'test2', 'test3'],
      msgstr: [],
      substitutions: []
    };

    assert.equal(
      t.pSubstituteStrings(str, descr),
      'This str has 2 plurality factor'
    );
  });

  it('substituteStrings: proper substitution of plurality factor in many places for plural forms', () => {
    let t = getController();
    let str = 'This str has %% plurality factor and %% factor again';
    let descr: Descriptor = {
      type: '_nt',
      factor: 2,
      msgid: 'test1', // ignored
      msgidPlural: 'test3', // ignored
      allPlurals: ['test1', 'test2', 'test3'],
      msgstr: [],
      substitutions: []
    };

    assert.equal(
      t.pSubstituteStrings(str, descr),
      'This str has 2 plurality factor and 2 factor again'
    );
  });

  it('substituteStrings: proper substitution of parameters and plurality factor for plural forms', () => {
    let t = getController();
    let str = 'This str has %% plurality factor and %1, %2 and %3 with %1 and %3 values again';
    let descr: Descriptor = {
      type: '_nt',
      factor: 2,
      msgid: 'test1', // ignored
      msgidPlural: 'test3', // ignored
      allPlurals: ['test1', 'test2', 'test3'],
      msgstr: [],
      substitutions: [
        'param1',
        'param2',
        'param3'
      ]
    };

    assert.equal(
      t.pSubstituteStrings(str, descr),
      'This str has 2 plurality factor and param1, param2 and param3 with param1 and param3 values again'
    );
  });

  it('substituteStrings throws error if not all substitutions have been done', () => {
    let t = getController();
    let str = 'This str has %1, %2 and %3 as values';
    let descr: Descriptor = {
      type: '_t',
      msgid: 'test1', // ignored
      msgstr: '',
      substitutions: [
        'param1',
        'param2'
      ]
    };

    assert.equal(
      t.pSubstituteStrings(str, descr),
      'This str has param1, param2 and %3 as values'
    );
    assert.equal(getFailedSubstitutions().length, 1);
  });

  it('Makes new dictionary from JSON file items', () => {
    let t = getController();
    let items: I18NEntry[] = [{
      type: 'single',
      entry: 'test1',
      translation: 'trans1'
    }, {
      type: 'single',
      entry: 'test2',
      context: 'ctx1',
      translation: 'trans2'
    }, {
      type: 'plural',
      entry: ['test3-1', 'test3-2'],
      translations: ['trans3-1', 'trans3-2', 'trans3-3'] // different forms count!
    }, {
      type: 'plural',
      context: 'ctx2',
      entry: ['test4-1', 'test4-2'],
      translations: ['trans4-1', 'trans4-2', 'trans4-3'] // different forms count!
    }];

    assert.deepEqual(t.pMakeNewDict(items), {
      'test1': ['trans1'],
      'ctx:ctx1;test2': ['trans2'],
      'plural:test3-2;test3-1': ['trans3-1', 'trans3-2', 'trans3-3'],
      'ctx:ctx2;plural:test4-2;test4-1': ['trans4-1', 'trans4-2', 'trans4-3']
    });
  });

  it('Makes proper selection function from JSON file', () => {
    let t = getController();
    let funcs = {
      // key: plurality formula
      'nplurals=1; plural=0;': {
        0: 0, // key: plurality factor; value: expected # of plural form
        1: 0,
        2: 0,
        5: 0
      },
      'nplurals=2; plural=n != 1;': {
        0: 1,
        1: 0,
        2: 1,
        5: 1
      },
      'nplurals=3; plural=n%10==1 && n%100!=11 ? 0 : n != 0 ? 1 : 2;': {
        0: 2,
        1: 0,
        2: 1,
        10: 1,
        11: 1,
        21: 0,
        111: 1
      },
      'nplurals=3; plural=n%10==1 && n%100!=11 ? 0 : n%10>=2 && n%10<=4 && (n%100<10 || n%100>=20) ? 1 : 2;': {
        0: 2,
        1: 0,
        2: 1,
        3: 1,
        4: 1,
        5: 2,
        11: 2,
        21: 0,
        111: 2
      },
      'nplurals=6; plural=n==0 ? 0 : n==1 ? 1 : n==2 ? 2 : n%100>=3 && n%100<=10 ? 3 : n%100>=11 ? 4 : 5;': {
        0: 0,
        1: 1,
        2: 2,
        3: 3,
        4: 3,
        9: 3,
        10: 3,
        101: 5,
        102: 5,
        108: 3,
        112: 4,
        120: 4
      }
    };

    for (let strfun in funcs) {
      let plural = t.pMakePluralSelectFunction(strfun);
      for (let factor in funcs[strfun]) {
        let plVal = plural(parseInt(factor));
        assert.equal(
          plVal,
          funcs[strfun][factor],
          `Func: ${strfun} (failed on factor ${factor}: expected ${funcs[strfun][factor]} but got ${plVal})`
        );
      }
    }
  });

  it('Throws error on incorrect selection function in JSON file', () => {
    let t = getController();
    let exceptions = [];

    try {
      let plural = t.pMakePluralSelectFunction('nprals=1; plural=0;'); // typo
    } catch (e) {
      exceptions.push(e);
    }

    try {
      let plural = t.pMakePluralSelectFunction('nplurals=6; plural=n==0 ? 0 : n==1 ? 1 : n==2 ? 2 :'); // invalid func syntax
    } catch (e) {
      exceptions.push(e);
    }

    assert.equal(exceptions[0] instanceof Error, true);
    assert.equal(exceptions[1] instanceof SyntaxError, true);
  });

  it('Integration: properly loads locale file by name (via setLocale)', (done) => {
    setTranslationGetter((name: string, onReady: (name: string, contents: string) => void) => onReady(name, testLocaleJson));
    let t = getController();
    t.setLocale('cs_cz', (name: string) => {
      assert.equal(name, 'cs_cz'); // should match with name passed to setLocale
      assert.equal(t.mDictMeta().language, 'cs_CZ'); // should match with value in json
      assert.equal(Object.keys(t.mDictionary()).length, 4); // entries count in test file
      assert.notEqual(t.mPluralSelect(), undefined);
      done();
    }, (err: any) => {
      assert.equal(err, undefined);
      done();
    });
  });

  it('Integration: properly gets string from loaded dictionary with _t', (done) => {
    setTranslationGetter((name: string, onReady: (name: string, contents: string) => void) => onReady(name, testLocaleJson));
    let t = getController();
    t.setLocale('cs_cz', (name: string) => {
      let descr: Descriptor = {
        type: '_t',
        msgid: '"%1" не подключает по вашему адресу.',
        msgstr: '',
        substitutions: ['Provider']
      };
      assert.equal(t.getString(descr), '"Provider" neumožňuje připojení na Vaší adrese.');
      done();
    }, (err: any) => {
      assert.equal(err, undefined);
      done();
    });
  });

  it('Integration: properly gets string from loaded dictionary with _pt', (done) => {
    setTranslationGetter((name: string, onReady: (name: string, contents: string) => void) => onReady(name, testLocaleJson));
    let t = getController();
    t.setLocale('cs_cz', (name: string) => {
      let descr: Descriptor = {
        type: '_pt',
        msgid: '%1&nbsp;км',
        msgctxt: 'километры',
        msgstr: '',
        substitutions: ['23']
      };
      assert.equal(t.getString(descr), '23&nbsp;km');
      done();
    }, (err: any) => {
      assert.equal(err, undefined);
      done();
    });
  });

  it('Integration: properly gets string from loaded dictionary with _nt', (done) => {
    setTranslationGetter((name: string, onReady: (name: string, contents: string) => void) => onReady(name, testLocaleJson));
    let t = getController();
    t.setLocale('cs_cz', (name: string) => {
      let descr: Descriptor = {
        type: '_nt',
        factor: 0,
        msgid: '%% ТВ-канал',
        msgidPlural: '%% ТВ-каналов',
        allPlurals: ['%% ТВ-канал', '%% ТВ-канала', '%% ТВ-каналов'],
        msgstr: [],
        substitutions: []
      };

      descr.factor = 1;
      assert.equal(t.getString(descr), '1 TV kanál');

      descr.factor = 3;
      assert.equal(t.getString(descr), '3 TV kanály');

      descr.factor = 8;
      assert.equal(t.getString(descr), '8 TV kanálů');

      done();
    }, (err: any) => {
      assert.equal(err, undefined);
      done();
    });
  });

  it('Integration: properly gets string from loaded dictionary with _npt', (done) => {
    setTranslationGetter((name: string, onReady: (name: string, contents: string) => void) => onReady(name, testLocaleJson));
    let t = getController();
    t.setLocale('cs_cz', (name: string) => {
      let descr: Descriptor = {
        type: '_npt',
        factor: 0,
        msgid: '%% место',
        msgidPlural: '%% мест',
        allPlurals: ['%% место', '%% места', '%% мест'],
        msgctxt: 'Вместимость парковки',
        msgstr: [],
        substitutions: []
      };

      descr.factor = 1;
      assert.equal(t.getString(descr), '1 místo');

      descr.factor = 3;
      assert.equal(t.getString(descr), '3 místa');

      descr.factor = 8;
      assert.equal(t.getString(descr), '8 míst');

      done();
    }, (err: any) => {
      assert.equal(err, undefined);
      done();
    });
  });

  it('Integration: properly gets fallback string when no dictionary loaded with _t', () => {
    let t = getController();
    let descr: Descriptor = {
      type: '_t',
      msgid: '"%1" не подключает по вашему адресу.',
      msgstr: '',
      substitutions: ['Provider']
    };
    assert.equal(t.getString(descr), '"Provider" не подключает по вашему адресу.');
  });

  it('Integration: properly gets fallback string when no dictionary loaded with _pt', () => {
    let t = getController();
    let descr: Descriptor = {
      type: '_pt',
      msgid: '%1&nbsp;км',
      msgctxt: 'километры',
      msgstr: '',
      substitutions: ['23']
    };
    assert.equal(t.getString(descr), '23&nbsp;км');
  });

  it('Integration: properly gets fallback string when no dictionary loaded with _nt', () => {
    let t = getController();
    let descr: Descriptor = {
      type: '_nt',
      factor: 0,
      msgid: '%% ТВ-канал',
      msgidPlural: '%% ТВ-каналов',
      allPlurals: ['%% ТВ-канал', '%% ТВ-канала', '%% ТВ-каналов'],
      msgstr: [],
      substitutions: []
    };

    descr.factor = 1;
    assert.equal(t.getString(descr), '1 ТВ-канал');

    descr.factor = 3;
    assert.equal(t.getString(descr), '3 ТВ-канала');

    descr.factor = 8;
    assert.equal(t.getString(descr), '8 ТВ-каналов');
  });

  it('Integration: properly gets fallback string when no dictionary loaded with _npt', () => {
    let t = getController();
    let descr: Descriptor = {
      type: '_npt',
      factor: 0,
      msgid: '%% место',
      msgidPlural: '%% мест',
      allPlurals: ['%% место', '%% места', '%% мест'],
      msgctxt: 'Вместимость парковки',
      msgstr: [],
      substitutions: []
    };

    descr.factor = 1;
    assert.equal(t.getString(descr), '1 место');

    descr.factor = 3;
    assert.equal(t.getString(descr), '3 места');

    descr.factor = 8;
    assert.equal(t.getString(descr), '8 мест');
  });

  it('Integration: properly gets forced untranslated string from loaded dictionary with _t', (done) => {
    setTranslationGetter((name: string, onReady: (name: string, contents: string) => void) => onReady(name, testLocaleJson));
    let t = getController();
    t.setLocale('cs_cz', (name: string) => {
      let descr: Descriptor = {
        type: '_t',
        msgid: '"%1" не подключает по вашему адресу.',
        msgstr: '',
        substitutions: ['Provider']
      };
      assert.equal(t.getString(descr, true), '"Provider" не подключает по вашему адресу.');
      done();
    }, (err: any) => {
      assert.equal(err, undefined);
      done();
    });
  });

  it('Integration: properly gets forced untranslated string from loaded dictionary with _pt', (done) => {
    setTranslationGetter((name: string, onReady: (name: string, contents: string) => void) => onReady(name, testLocaleJson));
    let t = getController();
    t.setLocale('cs_cz', (name: string) => {
      let descr: Descriptor = {
        type: '_pt',
        msgid: '%1&nbsp;км',
        msgctxt: 'километры',
        msgstr: '',
        substitutions: ['23']
      };
      assert.equal(t.getString(descr, true), '23&nbsp;км');
      done();
    }, (err: any) => {
      assert.equal(err, undefined);
      done();
    });
  });

  it('Integration: properly gets forced untranslated string from loaded dictionary with _nt', (done) => {
    setTranslationGetter((name: string, onReady: (name: string, contents: string) => void) => onReady(name, testLocaleJson));
    let t = getController();
    t.setLocale('cs_cz', (name: string) => {
      let descr: Descriptor = {
        type: '_nt',
        factor: 0,
        msgid: '%% ТВ-канал',
        msgidPlural: '%% ТВ-каналов',
        allPlurals: ['%% ТВ-канал', '%% ТВ-канала', '%% ТВ-каналов'],
        msgstr: [],
        substitutions: []
      };

      descr.factor = 1;
      assert.equal(t.getString(descr, true), '1 ТВ-канал');

      descr.factor = 3;
      assert.equal(t.getString(descr, true), '3 ТВ-канала');

      descr.factor = 8;
      assert.equal(t.getString(descr, true), '8 ТВ-каналов');

      done();
    }, (err: any) => {
      assert.equal(err, undefined);
      done();
    });
  });

  it('Integration: properly gets forced untranslated string from loaded dictionary with _npt', (done) => {
    setTranslationGetter((name: string, onReady: (name: string, contents: string) => void) => onReady(name, testLocaleJson));
    let t = getController();
    t.setLocale('cs_cz', (name: string) => {
      let descr: Descriptor = {
        type: '_npt',
        factor: 0,
        msgid: '%% место',
        msgidPlural: '%% мест',
        allPlurals: ['%% место', '%% места', '%% мест'],
        msgctxt: 'Вместимость парковки',
        msgstr: [],
        substitutions: []
      };

      descr.factor = 1;
      assert.equal(t.getString(descr, true), '1 место');

      descr.factor = 3;
      assert.equal(t.getString(descr, true), '3 места');

      descr.factor = 8;
      assert.equal(t.getString(descr, true), '8 мест');

      done();
    }, (err: any) => {
      assert.equal(err, undefined);
      done();
    });
  });
});

