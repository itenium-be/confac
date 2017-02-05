confac-back
===========
Starting DEV
------------

Expects running mongo with `src/config.json` settings.

```
# Start dev server
npm start
```

Template testing
----------------

```
# Compile html
gulp build
gulp watch

# Watch html (http://localhost:8080/)
npm run serve
```

TODO
====

- new invoice button when on new invoice should reset the form
- invoice list filters layout: bovenaan krijgen :p
- config: html templates: make dropdown list
- upload new templates / manage existing ones
- Template testing: css for #pageFooter so that elements with bottom: 0 are above the footer in the Html view
- isLoaded checks: replace with just one in App.js
- preview: geen melding van template niet gevonden
- create pdf: opens a window with phantomjs
- config.attachmentTypes: use selectlist instead of comma separated text input
- config.defaultClient&InvoiceExtraFields could be converted to StringsSelects instead (now label+value is stored in the db with value always empty)
- klantenlisting: naast edit ook een meer info icon om alle statistieken te zien... (ie resultaten per jaar)
- format numbers in nl-NL locale
- make download work on IE and Safari

DOM Test example
================

```
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
});
```
