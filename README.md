# secure-dev-server

A secure development proxy that lets you route different paths to different targets and has support for valid SSL.

## Install

```sh
$ npm i secure-dev-server --save-dev
```

This project uses [cosmiconfig](https://github.com/davidtheclark/cosmiconfig) for loading configuration files. You can configure your dev server in one of several ways:

1. Add `.devserverrc` in the root of your project:


```json
{
  "domain": "mysite.local",
  "ssl": true,
  "rules": [
    {
      "path": "/api/*",
      "target": "http://localhost:4003"
    },
    {
      "path": "/*",
      "target": "http://localhost:4200"
    }
  ]
}
```

You can use JSON and YAML formats. Alternatively you can name the file `.devserverrc.json` or `.devserverrc.yaml` to be more explicit.

2. Add `devserver` key to your `package.json`:

```json
{
  "devserver": {
    "domain": "mysite.local",
    // ...
  }
}
```

3. Add `devserver.config.js` to the root of your project and export a JavaScript object:


```js
module.exports = {
  domain: 'mysite.local',
  // ...
}
```

## Usage 

After configuring the `devserver` you can call it from your terminal:

```sh
$ sudo ./node_modules/.bin/secure-dev-server
```

or from an npm script:

```json
{
  "scripts": {
    "dev": "secure-dev-server"
  }
}
```
```sh
$ sudo npm run dev
```

Note that you need sudo because this script runs the host on `443` or `80` ports.

## License

This software is licensed under the [MIT License](LICENSE)
