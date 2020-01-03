confac-front
============

Some issues at:  
https://github.com/be-pongit/confac-front/issues

[Try it out live][demo] (without backend:)

Running the dev environment
---------------------------

Projects:

- confac-front: React/Redux, Bootstrap
- [confac-back][confac-back]: Koa, Html2Pdf
- [confac-vagrant][confac-vagrant]: MongoDB

front/back: `npm install` followed by `npm start`  
[vagrant][vagrant]: `vagrant up`

### Junction error

`npm start` fails with weird error when run from a junction.

```text
Parsing error: Unexpected token:

React.FC<P & ButtonWithClickOnceProps>
           ^
```


react-create-app
----------------

```bash
npm start
npm run build
npm run eject
```


Known Issues
------------

[react-tooltip: Slow when displaying many tooltips (ex: grid icons)](https://github.com/wwayne/react-tooltip/issues/334)  
Switched to `rc-tooltip`.



[confac-back]: https://github.com/be-pongit/confac-back
[confac-vagrant]: https://github.com/be-pongit/confac-vagrant
[vagrant]: https://www.vagrantup.com/
[demo]: https://pongit.be/assets/confac-demo/index.html
