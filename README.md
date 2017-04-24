confac-back
===========
Starting DEV
------------

Expects running mongo with `src/config.json` settings.  
A vagrant box with this configuration can be found in `confac-vagrant`.

```
# Start dev server
npm start
```

Template testing
----------------
Location: ./templates/*.pug

```
# Compile html
gulp build
gulp watch

# Watch html (http://localhost:8080/)
npm run serve
```

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
