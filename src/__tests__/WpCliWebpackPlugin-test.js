import WpCliWebpackPlugin from '../WpCliWebpackPlugin';
import path from 'path';
import pify from 'pify'; // eslint-disable-line node/no-unpublished-import
import tempy from 'tempy'; // eslint-disable-line node/no-unpublished-import
import test from 'ava'; // eslint-disable-line node/no-unpublished-import
import webpack from 'webpack'; // eslint-disable-line node/no-unpublished-import
import webpackConfigBase from './fixtures/config-base';

const fixturesDir = path.resolve(__dirname, 'fixtures');
const wpCliBinPath = path.join(fixturesDir, './wp-cli.phar');

test('should throw error if not passed `command` argument', t =>
    t.throws(() => new WpCliWebpackPlugin(), /Require\s`command`\sargument/));

test('should throw error if not passed `args` of `command` argument', t => {
    webpackConfigBase.output.path = tempy.directory();
    webpackConfigBase.plugins = [new WpCliWebpackPlugin({})];

    return t.throws(
        pify(webpack)(webpackConfigBase),
        /Each\scommand\sshould\shave\s`args`\sargument/
    );
});

test('should throw error if `args` argument is not array', t => {
    webpackConfigBase.output.path = tempy.directory();
    webpackConfigBase.plugins = [
        new WpCliWebpackPlugin({
            args: 'version'
        })
    ];

    return t.throws(
        pify(webpack)(webpackConfigBase),
        /Argument\s`args`\sof\seach\scommand\sshould\sbe\sarray/
    );
});

test('should successfully execute `version` command', t => {
    webpackConfigBase.output.path = tempy.directory();
    webpackConfigBase.plugins = [
        new WpCliWebpackPlugin(
            {
                args: ['cli', 'version']
            },
            {
                bin: wpCliBinPath
            }
        )
    ];

    return t.notThrows(pify(webpack)(webpackConfigBase));
});

test('should successfully execute `version` command with `bin` argument', t => {
    webpackConfigBase.output.path = tempy.directory();
    webpackConfigBase.plugins = [
        new WpCliWebpackPlugin({
            args: ['cli', 'version'],
            bin: wpCliBinPath
        })
    ];

    return t.notThrows(pify(webpack)(webpackConfigBase));
});

test('should successfully execute multiple commands', t => {
    webpackConfigBase.output.path = tempy.directory();
    webpackConfigBase.plugins = [
        new WpCliWebpackPlugin(
            [
                {
                    args: ['cli', 'version']
                },
                {
                    args: ['cli', 'info'],
                    format: 'json'
                }
            ],
            {
                bin: wpCliBinPath
            }
        )
    ];

    return t.notThrows(pify(webpack)(webpackConfigBase));
});
