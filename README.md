# wpcli-webpack-plugin

[![NPM version](https://img.shields.io/npm/v/wpcli-webpack-plugin.svg)](https://www.npmjs.org/package/wpcli-webpack-plugin)
[![Travis Build Status](https://img.shields.io/travis/itgalaxy/wpcli-webpack-plugin/master.svg?label=build)](https://travis-ci.org/itgalaxy/wpcli-webpack-plugin)
[![dependencies Status](https://david-dm.org/itgalaxy/wpcli-webpack-plugin/status.svg)](https://david-dm.org/itgalaxy/wpcli-webpack-plugin)
[![devDependencies Status](https://david-dm.org/itgalaxy/wpcli-webpack-plugin/dev-status.svg)](https://david-dm.org/itgalaxy/wpcli-webpack-plugin?type=dev)
[![Greenkeeper badge](https://badges.greenkeeper.io/itgalaxy/wpcli-webpack-plugin.svg)](https://greenkeeper.io/)

Webpack plugin for wp-cli

## Install

```shell
npm install --save-dev wpcli-webpack-plugin
```

## Usage

```js
import WpCliWebpackPlugin from 'wpcli-webpack-plugin';

export default {
    plugins: [
        new WpCliWebpackPlugin({
            args: ['cli', 'version']
        }, {
            bin: 'path/to/wp-cli.phar',
        })
    ]
};
```

## API

-   `command` (require) `string` or `array` - Executable command or commands.

-   `options` (optional) `object` - Options.

    -   `bin` - Path to `wp-cli` bin.

## Related

-   [wpcli](https://github.com/itgalaxy/wpcli) - Api for this package.

## Contribution

Feel free to push your code if you agree with publishing under the MIT license.

## [Changelog](CHANGELOG.md)

## [License](LICENSE)
