"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var assert_1 = tslib_1.__importDefault(require("assert"));
var utils_1 = require("./utils");
var fixture_1 = require("./fixture");
describe('I18n end-user library', function () {
    beforeEach(function () { return (0, utils_1.clearFailedSubstitutions)(); });
    // Note: these compatibility tests are very important to guarantee
    // that dictionary keys are formed in same way for i18n entries and descriptors.
    it('Compatibility: getDictKeyForEntry and getDictKeyForDescriptor values are compatible for _t', function () {
        var t = (0, utils_1.getController)();
        var entry = {
            type: 'single',
            entry: 'test'
        };
        var descr = {
            type: '_t',
            msgid: 'test',
            msgstr: '',
            substitutions: []
        };
        assert_1.default.strictEqual(t.pGetDictKeyForDescriptor(descr), t.pGetDictKeyForEntry(entry));
    });
    it('Compatibility: getDictKeyForEntry and getDictKeyForDescriptor values are compatible for _pt', function () {
        var t = (0, utils_1.getController)();
        var entry = {
            type: 'single',
            entry: 'test',
            context: 'ctx'
        };
        var descr = {
            type: '_pt',
            msgid: 'test',
            msgstr: '',
            msgctxt: 'ctx',
            substitutions: []
        };
        assert_1.default.strictEqual(t.pGetDictKeyForDescriptor(descr), t.pGetDictKeyForEntry(entry));
    });
    it('Compatibility: getDictKeyForEntry and getDictKeyForDescriptor values are compatible for _nt', function () {
        var t = (0, utils_1.getController)();
        var entry = {
            type: 'plural',
            entry: ['test1', 'test3'],
            translations: []
        };
        var descr = {
            type: '_nt',
            factor: 2,
            msgid: 'test1',
            msgidPlural: 'test3',
            allPlurals: ['test1', 'test2', 'test3'],
            msgstr: [],
            substitutions: []
        };
        assert_1.default.strictEqual(t.pGetDictKeyForDescriptor(descr), t.pGetDictKeyForEntry(entry));
    });
    it('Compatibility: getDictKeyForEntry and getDictKeyForDescriptor values are compatible for _npt', function () {
        var t = (0, utils_1.getController)();
        var entry = {
            type: 'plural',
            entry: ['test1', 'test3'],
            translations: [],
            context: 'ctx'
        };
        var descr = {
            type: '_npt',
            factor: 2,
            msgid: 'test1',
            msgidPlural: 'test3',
            allPlurals: ['test1', 'test2', 'test3'],
            msgctxt: 'ctx',
            msgstr: [],
            substitutions: []
        };
        assert_1.default.strictEqual(t.pGetDictKeyForDescriptor(descr), t.pGetDictKeyForEntry(entry));
    });
    it('Selects proper plural form with selectPluralForm and default selector', function () {
        var t = (0, utils_1.getController)();
        var descr = {
            type: '_nt',
            factor: 2,
            msgid: 'test1', // ignored
            msgidPlural: 'test3', // ignored
            allPlurals: ['test1', 'test2', 'test3'],
            msgstr: [],
            substitutions: []
        };
        // default selector is russian
        assert_1.default.strictEqual(t.pSelectPluralForm(['одна форма', 'две-четыре формы', 'пять и более форм'], descr, /*forceUntranslated = */ false), 'две-четыре формы');
        descr.factor = 1;
        assert_1.default.strictEqual(t.pSelectPluralForm(['одна форма', 'две-четыре формы', 'пять и более форм'], descr, /*forceUntranslated = */ false), 'одна форма');
        descr.factor = 6;
        assert_1.default.strictEqual(t.pSelectPluralForm(['одна форма', 'две-четыре формы', 'пять и более форм'], descr, /*forceUntranslated = */ false), 'пять и более форм');
    });
    it('Selects one and only form with selectPluralForm and default selector, if descriptor is not plural', function () {
        var t = (0, utils_1.getController)();
        var descr = {
            type: '_t',
            msgid: 'test1', // ignored
            msgstr: '',
            substitutions: []
        };
        // default selector is russian
        assert_1.default.strictEqual(t.pSelectPluralForm(['одна форма'], descr, /*forceUntranslated = */ false), 'одна форма');
    });
    it('substituteStrings: proper substitution of single parameter', function () {
        var t = (0, utils_1.getController)();
        var str = 'This str has %1 as a value';
        var descr = {
            type: '_t',
            msgid: 'test1', // ignored
            msgstr: '',
            substitutions: [
                'param1'
            ]
        };
        assert_1.default.strictEqual(t.pSubstituteStrings(str, descr), 'This str has param1 as a value');
    });
    it('substituteStrings: proper substitution of single parameter in many places', function () {
        var t = (0, utils_1.getController)();
        var str = 'This str has %1 as a value and %1 once again';
        var descr = {
            type: '_t',
            msgid: 'test1', // ignored
            msgstr: '',
            substitutions: [
                'param1'
            ]
        };
        assert_1.default.strictEqual(t.pSubstituteStrings(str, descr), 'This str has param1 as a value and param1 once again');
    });
    it('substituteStrings: proper substitution of multiple different parameters', function () {
        var t = (0, utils_1.getController)();
        var str = 'This str has %1, %2 and %3 as values';
        var descr = {
            type: '_t',
            msgid: 'test1', // ignored
            msgstr: '',
            substitutions: [
                'param1',
                'param2',
                'param3'
            ]
        };
        assert_1.default.strictEqual(t.pSubstituteStrings(str, descr), 'This str has param1, param2 and param3 as values');
    });
    it('substituteStrings: proper substitution of multiple different parameters in many places', function () {
        var t = (0, utils_1.getController)();
        var str = 'This str has %1, %2 and %3 as values, and also %1 and %3 as more values';
        var descr = {
            type: '_t',
            msgid: 'test1', // ignored
            msgstr: '',
            substitutions: [
                'param1',
                'param2',
                'param3'
            ]
        };
        assert_1.default.strictEqual(t.pSubstituteStrings(str, descr), 'This str has param1, param2 and param3 as values, and also param1 and param3 as more values');
    });
    it('substituteStrings: proper substitution of plurality factor for plural forms', function () {
        var t = (0, utils_1.getController)();
        var str = 'This str has %% plurality factor';
        var descr = {
            type: '_nt',
            factor: 2,
            msgid: 'test1', // ignored
            msgidPlural: 'test3', // ignored
            allPlurals: ['test1', 'test2', 'test3'],
            msgstr: [],
            substitutions: []
        };
        assert_1.default.strictEqual(t.pSubstituteStrings(str, descr), 'This str has 2 plurality factor');
    });
    it('substituteStrings: proper substitution of plurality factor in many places for plural forms', function () {
        var t = (0, utils_1.getController)();
        var str = 'This str has %% plurality factor and %% factor again';
        var descr = {
            type: '_nt',
            factor: 2,
            msgid: 'test1', // ignored
            msgidPlural: 'test3', // ignored
            allPlurals: ['test1', 'test2', 'test3'],
            msgstr: [],
            substitutions: []
        };
        assert_1.default.strictEqual(t.pSubstituteStrings(str, descr), 'This str has 2 plurality factor and 2 factor again');
    });
    it('substituteStrings: proper substitution of parameters and plurality factor for plural forms', function () {
        var t = (0, utils_1.getController)();
        var str = 'This str has %% plurality factor and %1, %2 and %3 with %1 and %3 values again';
        var descr = {
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
        assert_1.default.strictEqual(t.pSubstituteStrings(str, descr), 'This str has 2 plurality factor and param1, param2 and param3 with param1 and param3 values again');
    });
    it('substituteStrings throws error if not all substitutions have been done', function () {
        var t = (0, utils_1.getController)();
        var str = 'This str has %1, %2 and %3 as values';
        var descr = {
            type: '_t',
            msgid: 'test1', // ignored
            msgstr: '',
            substitutions: [
                'param1',
                'param2'
            ]
        };
        assert_1.default.strictEqual(t.pSubstituteStrings(str, descr), 'This str has param1, param2 and %3 as values');
        assert_1.default.strictEqual((0, utils_1.getFailedSubstitutions)().length, 1);
    });
    it('Makes new dictionary from JSON file items', function () {
        var t = (0, utils_1.getController)();
        var items = [{
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
            }, {
                type: 'single', // no transaltion provided
                entry: 'test2',
                context: 'ctx3'
            }, {
                type: 'plural',
                context: 'ctx4',
                entry: ['test5-1', 'test5-2'],
                translations: ['', '', 'trans5-3'] // not all translations provided
            }];
        assert_1.default.deepStrictEqual(t.pMakeNewDict(items), {
            'test1': ['trans1'],
            'ctx:ctx1;test2': ['trans2'],
            'plural:test3-2;test3-1': ['trans3-1', 'trans3-2', 'trans3-3'],
            'ctx:ctx2;plural:test4-2;test4-1': ['trans4-1', 'trans4-2', 'trans4-3']
        });
    });
    it('Makes proper selection function from JSON file', function () {
        var _a;
        var t = (0, utils_1.getController)();
        var funcs = {
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
        for (var strfun in funcs) {
            var plural = t.pMakePluralSelectFunction(strfun);
            for (var factor in funcs[strfun]) {
                var plVal = plural((_a = parseInt(factor)) !== null && _a !== void 0 ? _a : 0);
                assert_1.default.strictEqual(plVal, funcs[strfun][factor], "Func: ".concat(strfun, " (failed on factor ").concat(factor, ": expected ").concat(funcs[strfun][factor], " but got ").concat(plVal, ")"));
            }
        }
    });
    it('Throws error on incorrect selection function in JSON file', function () {
        var t = (0, utils_1.getController)();
        var exceptions = [];
        try {
            t.pMakePluralSelectFunction('nprals=1; plural=0;'); // typo
        }
        catch (e) {
            exceptions.push(e);
        }
        try {
            t.pMakePluralSelectFunction('nplurals=6; plural=n==0 ? 0 : n==1 ? 1 : n==2 ? 2 :'); // invalid func syntax
        }
        catch (e) {
            exceptions.push(e);
        }
        assert_1.default.strictEqual(exceptions[0] instanceof Error, true);
        assert_1.default.strictEqual(exceptions[1] instanceof SyntaxError, true);
    });
    it('Integration: properly loads locale file by name (via setLocale)', function (done) {
        (0, utils_1.setTranslationGetter)(function (name, onReady) { return onReady(name, fixture_1.testLocaleJson); });
        var t = (0, utils_1.getController)();
        t.setLocale('cs_cz', function (name) {
            var _a;
            assert_1.default.strictEqual(name, 'cs_cz'); // should match with name passed to setLocale
            assert_1.default.strictEqual(((_a = t.mDictMeta()) !== null && _a !== void 0 ? _a : { language: '' }).language, 'cs_CZ'); // should match with value in json
            assert_1.default.strictEqual(Object.keys(t.mDictionary()).length, 4); // entries count in test file
            assert_1.default.notStrictEqual(t.mPluralSelect(), undefined);
            done();
        }, function (err) {
            assert_1.default.strictEqual(err, undefined);
            done();
        });
    });
    it('Integration: properly gets string from loaded dictionary with _t', function (done) {
        (0, utils_1.setTranslationGetter)(function (name, onReady) { return onReady(name, fixture_1.testLocaleJson); });
        var t = (0, utils_1.getController)();
        t.setLocale('cs_cz', function (_name) {
            var descr = {
                type: '_t',
                msgid: '"%1" не подключает по вашему адресу.',
                msgstr: '',
                substitutions: ['Provider']
            };
            assert_1.default.strictEqual(t.getString(descr), '"Provider" neumožňuje připojení na Vaší adrese.');
            done();
        }, function (err) {
            assert_1.default.strictEqual(err, undefined);
            done();
        });
    });
    it('Integration: properly gets string from loaded dictionary with _pt', function (done) {
        (0, utils_1.setTranslationGetter)(function (name, onReady) { return onReady(name, fixture_1.testLocaleJson); });
        var t = (0, utils_1.getController)();
        t.setLocale('cs_cz', function (_name) {
            var descr = {
                type: '_pt',
                msgid: '%1&nbsp;км',
                msgctxt: 'километры',
                msgstr: '',
                substitutions: ['23']
            };
            assert_1.default.strictEqual(t.getString(descr), '23&nbsp;km');
            done();
        }, function (err) {
            assert_1.default.strictEqual(err, undefined);
            done();
        });
    });
    it('Integration: properly gets string from loaded dictionary with _nt', function (done) {
        (0, utils_1.setTranslationGetter)(function (name, onReady) { return onReady(name, fixture_1.testLocaleJson); });
        var t = (0, utils_1.getController)();
        t.setLocale('cs_cz', function (_name) {
            var descr = {
                type: '_nt',
                factor: 0,
                msgid: '%% ТВ-канал',
                msgidPlural: '%% ТВ-каналов',
                allPlurals: ['%% ТВ-канал', '%% ТВ-канала', '%% ТВ-каналов'],
                msgstr: [],
                substitutions: []
            };
            descr.factor = 1;
            assert_1.default.strictEqual(t.getString(descr), '1 TV kanál');
            descr.factor = 3;
            assert_1.default.strictEqual(t.getString(descr), '3 TV kanály');
            descr.factor = 8;
            assert_1.default.strictEqual(t.getString(descr), '8 TV kanálů');
            done();
        }, function (err) {
            assert_1.default.strictEqual(err, undefined);
            done();
        });
    });
    it('Integration: properly gets string from loaded dictionary with _npt', function (done) {
        (0, utils_1.setTranslationGetter)(function (name, onReady) { return onReady(name, fixture_1.testLocaleJson); });
        var t = (0, utils_1.getController)();
        t.setLocale('cs_cz', function (_name) {
            var descr = {
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
            assert_1.default.strictEqual(t.getString(descr), '1 místo');
            descr.factor = 3;
            assert_1.default.strictEqual(t.getString(descr), '3 místa');
            descr.factor = 8;
            assert_1.default.strictEqual(t.getString(descr), '8 míst');
            done();
        }, function (err) {
            assert_1.default.strictEqual(err, undefined);
            done();
        });
    });
    it('Integration: properly gets fallback string when no dictionary loaded with _t', function () {
        var t = (0, utils_1.getController)();
        var descr = {
            type: '_t',
            msgid: '"%1" не подключает по вашему адресу.',
            msgstr: '',
            substitutions: ['Provider']
        };
        assert_1.default.strictEqual(t.getString(descr), '"Provider" не подключает по вашему адресу.');
    });
    it('Integration: properly gets fallback string when no dictionary loaded with _pt', function () {
        var t = (0, utils_1.getController)();
        var descr = {
            type: '_pt',
            msgid: '%1&nbsp;км',
            msgctxt: 'километры',
            msgstr: '',
            substitutions: ['23']
        };
        assert_1.default.strictEqual(t.getString(descr), '23&nbsp;км');
    });
    it('Integration: properly gets fallback string when no dictionary loaded with _nt', function () {
        var t = (0, utils_1.getController)();
        var descr = {
            type: '_nt',
            factor: 0,
            msgid: '%% ТВ-канал',
            msgidPlural: '%% ТВ-каналов',
            allPlurals: ['%% ТВ-канал', '%% ТВ-канала', '%% ТВ-каналов'],
            msgstr: [],
            substitutions: []
        };
        descr.factor = 1;
        assert_1.default.strictEqual(t.getString(descr), '1 ТВ-канал');
        descr.factor = 3;
        assert_1.default.strictEqual(t.getString(descr), '3 ТВ-канала');
        descr.factor = 8;
        assert_1.default.strictEqual(t.getString(descr), '8 ТВ-каналов');
    });
    it('Integration: properly gets fallback string when no dictionary loaded with _npt', function () {
        var t = (0, utils_1.getController)();
        var descr = {
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
        assert_1.default.strictEqual(t.getString(descr), '1 место');
        descr.factor = 3;
        assert_1.default.strictEqual(t.getString(descr), '3 места');
        descr.factor = 8;
        assert_1.default.strictEqual(t.getString(descr), '8 мест');
    });
    it('Integration: properly gets forced untranslated string from loaded dictionary with _t', function (done) {
        (0, utils_1.setTranslationGetter)(function (name, onReady) { return onReady(name, fixture_1.testLocaleJson); });
        var t = (0, utils_1.getController)();
        t.setLocale('cs_cz', function (_name) {
            var descr = {
                type: '_t',
                msgid: '"%1" не подключает по вашему адресу.',
                msgstr: '',
                substitutions: ['Provider']
            };
            assert_1.default.strictEqual(t.getString(descr, true), '"Provider" не подключает по вашему адресу.');
            done();
        }, function (err) {
            assert_1.default.strictEqual(err, undefined);
            done();
        });
    });
    it('Integration: properly gets forced untranslated string from loaded dictionary with _pt', function (done) {
        (0, utils_1.setTranslationGetter)(function (name, onReady) { return onReady(name, fixture_1.testLocaleJson); });
        var t = (0, utils_1.getController)();
        t.setLocale('cs_cz', function (_name) {
            var descr = {
                type: '_pt',
                msgid: '%1&nbsp;км',
                msgctxt: 'километры',
                msgstr: '',
                substitutions: ['23']
            };
            assert_1.default.strictEqual(t.getString(descr, true), '23&nbsp;км');
            done();
        }, function (err) {
            assert_1.default.strictEqual(err, undefined);
            done();
        });
    });
    it('Integration: properly gets forced untranslated string from loaded dictionary with _nt', function (done) {
        (0, utils_1.setTranslationGetter)(function (name, onReady) { return onReady(name, fixture_1.testLocaleJson); });
        var t = (0, utils_1.getController)();
        t.setLocale('cs_cz', function (_name) {
            var descr = {
                type: '_nt',
                factor: 0,
                msgid: '%% ТВ-канал',
                msgidPlural: '%% ТВ-каналов',
                allPlurals: ['%% ТВ-канал', '%% ТВ-канала', '%% ТВ-каналов'],
                msgstr: [],
                substitutions: []
            };
            descr.factor = 1;
            assert_1.default.strictEqual(t.getString(descr, true), '1 ТВ-канал');
            descr.factor = 3;
            assert_1.default.strictEqual(t.getString(descr, true), '3 ТВ-канала');
            descr.factor = 8;
            assert_1.default.strictEqual(t.getString(descr, true), '8 ТВ-каналов');
            done();
        }, function (err) {
            assert_1.default.strictEqual(err, undefined);
            done();
        });
    });
    it('Integration: properly gets forced untranslated string from loaded dictionary with _npt', function (done) {
        (0, utils_1.setTranslationGetter)(function (name, onReady) { return onReady(name, fixture_1.testLocaleJson); });
        var t = (0, utils_1.getController)();
        t.setLocale('cs_cz', function (_name) {
            var descr = {
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
            assert_1.default.strictEqual(t.getString(descr, true), '1 место');
            descr.factor = 3;
            assert_1.default.strictEqual(t.getString(descr, true), '3 места');
            descr.factor = 8;
            assert_1.default.strictEqual(t.getString(descr, true), '8 мест');
            done();
        }, function (err) {
            assert_1.default.strictEqual(err, undefined);
            done();
        });
    });
    it('substituteStrings throws error if there is no plural form for current factor in current locale', function () {
        var t = (0, utils_1.getController)();
        var str = '';
        var descr = {
            type: '_nt',
            factor: 2,
            msgid: 'test1', // ignored
            msgidPlural: 'test3', // ignored
            allPlurals: ['test1', 'test2'],
            msgstr: [],
            substitutions: ['param1', 'param2'],
        };
        assert_1.default.strictEqual(t.pSubstituteStrings(str, descr), 'test1');
        assert_1.default.strictEqual((0, utils_1.getFailedSubstitutions)().length, 1);
    });
});
//# sourceMappingURL=controller.spec.js.map