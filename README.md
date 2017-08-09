# i18n-dialect

`dialect` is a library to support runtime i18n functions.

## Usage

`dialect` exports a controller class called `TranslationController`, which should be instantiated in your application. Controller's constructor has following configurational parameters:
-  **translationGetter**: a used-defined function to receive translated content as JSON file. Library does not know about any ways your application can use to receive these files, for example, it might be a simple `require` when running on server side, or asynchronous file load with `fetch` or other asynchronous request library.
- **onFailedSubstitution**: a callback, which will be called every time any `%N` substitution is failed; may be undefined.
- **defaultPluralSelect**: a function that will be a default for plural forms selection. Usually, this should be a plural selector of developers' primary language.

The `TranslationController` object also has a `setLocale` method to update internal dictionary - once this is done, the changes are applied to all subsequent calls of translation functions. Notice that `setLocale` method is asynchronous, so updating your user interface should not be done right after it's call: you should wait until everything is loaded and parsed.

### Function interface

`dialect` exports four simple translation functions:
- `_tGen` for simple translations
- `_ptGen` for contextual translations
- `_ntGen` for plural translations
- `_nptGen` for contextual plural translations

These functions are function generators (higher order functions), and before using them in your project you should parameterize them with `TranslationController` instance, like this:
```
import { TranslationController, _tGen, _ptGen, _ntGen, _nptGen } from 'i18n-dialect';

let controller = new TranslationController(...);

export const _t = _tGen(controller);
export const _pt = _ptGen(controller);
export const _nt = _ntGen(controller);
export const _npt = _nptGen(controller);
```
In some other file:
```
import { _t, _pt, _nt, _npt } from '...';

// now you can use _t, _pt, etc.
```

Make sure that names of your created functions are strictly equal to `_t`, `_nt`, `_pt` and `_npt`, and you use these functions with these names only in your code; otherwise your translations will not be parsed successfully with `i18n-stex` parser.

### Object interface

`dialect` also exports a single class called `TranslationProvider`, which simplifies interaction with library for a bit. You should instantiate it once and then just pass it into your other files and components. Example:

```
import { TranslationController, TranslationProvider } from 'i18n-dialect';

let controller = new TranslationController(...);
export const i18n = new TranslationProvider(controller);

```
In some other file:
```
import { i18n } from '...';

// now you can use i18n._t, i18n._pt, etc.
```

## Contributing

i18n-dialect uses github-flow to accept & merge fixes and improvements. Basic process is:
- Fork the repo.
- Create a branch.
- Add or fix some code.
- **Run Karma testing suite with `npm run test` and make sure nothing is broken**
- Add some tests for your new code or fix broken tests.
- Run `npm run build` to build pure-js distribution files.
- Commit & push.
- Create a new pull request to original repo.

Pull requests with failing tests will not be accepted. Also, if you add or modify packages to `package.json`, make sure you use `yarn` and update `yarn.lock`.
