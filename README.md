confac-back
===========
Starting DEV
------------

Expects running mongo with `config.json` settings.

```
# Start server
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

- invoice list filters layout: bovenaan krijgen :p
- invoice: line type (ability to fill in in hours or days) / extra type: items (=quantity & price)
- ability to keep track of extra fields for your-company and clients
- upload new templates / manage existing ones
- config setting: show orderNr in invoice list
- bijlagen toevoegen aan een client (timesheet template etc)
- per client instellen welk de default dag is (last prev month, today, ...)
- Template testing: css for #pageFooter so that elements with bottom: 0 are above the footer in the Html view
