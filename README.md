confac-front
============

Running the dev environment
---------------------------

Projects:

- confac-front: React/Redux, Bootstrap
- confac-back: Express, Html2Pdf, MongoDB

front/back: `npm install` followed by `npm start`  

### Junction error

`npm start` fails with weird error when run from a junction.

```text
Parsing error: Unexpected token:

React.FC<P & ButtonWithClickOnceProps>
           ^
```


Known Issues
------------

[react-tooltip: Slow when displaying many tooltips (ex: grid icons)](https://github.com/wwayne/react-tooltip/issues/334)  
Switched to `rc-tooltip`.
