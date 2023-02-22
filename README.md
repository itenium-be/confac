confac-front
============

Node v16.10.0


Some issues at:  
https://github.com/be-pongit/confac-front/issues

[Try it out live][demo] (without backend:)

Running the dev environment
---------------------------

Projects:

- confac-front: React/Redux, Bootstrap
- [confac-back][confac-back]: Express, Html2Pdf, MongoDB

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


[confac-back]: https://github.com/be-pongit/confac-back
[demo]: https://pongit.be/assets/confac-demo/index.html
