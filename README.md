confac-back
===========
Starting DEV
------------

Expects running mongo with `src/config.js` settings.

```
# Start dev server
npm start
```

Invoice list & EditInvoice: Preview button doesn't work?
EditInvoice: Popup with update pdf (on bewaren) YES, NO, CANCEL


--> Templates shared volume in Dockerfile


TODO: next invoice nr --> last date invoice nr + 1


Template testing
----------------

```
# Compile html
gulp build
gulp watch

# Watch html (http://localhost:8080/)
npm run serve
```

MoSCoW
======
**Must**:  

- invoice list filters layout: bovenaan krijgen :p

**Should**:  

- format numbers in nl-NL locale (display & inputs)
- editinvoice form without save and then upload attachment: normal changes are gone
- new invoice button when on new invoice should reset the form
- make download work on IE and Safari

**Could**:  

- EditInvoice: Adding an invoice attachment: select first not yet picked attachment from the list
- config: html templates: make dropdown list
- preview: geen melding van template niet gevonden

**Wish**:  

- InvoiceList: als er maar 1 factuur is op de maand: dan wel de volledige details tonen
--> of sowieso groeperen per maand in de "dagen" kolom (wat borders wegdoen...)
- upload new templates / manage existing ones
- klantenlisting: naast edit ook een meer info icon om alle statistieken te zien... (ie resultaten per jaar)
- Nieuwe factuur button right aligned with the container

**Technical debt**:  

- isLoaded checks: replace with just one in App.js
- config.defaultClient&InvoiceExtraFields could be converted to StringsSelects instead (now label+value is stored in the db with value always empty)
- create pdf: opens a window with phantomjs --> html-pdf option? "phantomPath": "./node_modules/phantomjs/bin/phantomjs"
- Template testing: css for #pageFooter so that elements with bottom: 0 are above the footer in the Html view

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
