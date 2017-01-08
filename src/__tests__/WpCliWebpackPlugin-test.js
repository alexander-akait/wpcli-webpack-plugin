import WpCliWebpackPlugin from '../WpCliWebpackPlugin';
import path from 'path';
import pify from 'pify'; // eslint-disable-line node/no-unpublished-import
import test from 'ava'; // eslint-disable-line node/no-unpublished-import
import tmp from 'tmp'; // eslint-disable-line node/no-unpublished-import
import webpack from 'webpack'; // eslint-disable-line node/no-unpublished-import
import webpackConfigBase from './fixtures/config-base';

const fixturesDir = path.resolve(__dirname, 'fixtures');
const wpCliBinPath = path.join(fixturesDir, './wp-cli.phar');

test('should throw error if not passed `command` argument', (t) => {
    t.throws(() => new WpCliWebpackPlugin(), /Require\s`command`\sargument/);
});

test(
    'should throw error if not passed `args` of `command` argument',
    (t) => pify(tmp.dir, {
        multiArgs: true
    })({
        unsafeCleanup: true
    })
        .then((result) => {
            const [tmpPath, cleanupCallback] = result;

            webpackConfigBase.output.path = tmpPath;

            webpackConfigBase.plugins = [
                new WpCliWebpackPlugin({})
            ];

            t.throws(pify(webpack)(webpackConfigBase), /Each\scommand\sshould\shave\s`args`\sargument/);

            return cleanupCallback();
        })
);

test(
    'should throw error if `args` argument is not array',
    (t) => pify(tmp.dir, {
        multiArgs: true
    })({
        unsafeCleanup: true
    })
        .then((result) => {
            const [tmpPath, cleanupCallback] = result;

            webpackConfigBase.output.path = tmpPath;

            webpackConfigBase.plugins = [
                new WpCliWebpackPlugin({
                    args: 'version'
                })
            ];

            t.throws(pify(webpack)(webpackConfigBase), /Argument\s`args`\sof\seach\scommand\sshould\sbe\sarray/);

            return cleanupCallback();
        })
);

test(
    'should successfully execute `version` command',
    (t) => pify(tmp.dir, {
        multiArgs: true
    })({
        unsafeCleanup: true
    })
        .then((result) => {
            const [tmpPath, cleanupCallback] = result;

            webpackConfigBase.output.path = tmpPath;

            webpackConfigBase.plugins = [
                new WpCliWebpackPlugin({
                    args: ['cli', 'version']
                }, {
                    bin: wpCliBinPath
                })
            ];

            t.notThrows(pify(webpack)(webpackConfigBase));

            return cleanupCallback();
        })
);

test(
    'should successfully execute `version` command with `bin` argument',
    (t) => pify(tmp.dir, {
        multiArgs: true
    })({
        unsafeCleanup: true
    })
        .then((result) => {
            const [tmpPath, cleanupCallback] = result;

            webpackConfigBase.output.path = tmpPath;

            webpackConfigBase.plugins = [
                new WpCliWebpackPlugin({
                    args: ['cli', 'version'],
                    bin: wpCliBinPath
                })
            ];

            t.notThrows(pify(webpack)(webpackConfigBase));

            return cleanupCallback();
        })
);

test(
    'should successfully execute multiple commands',
    (t) => pify(tmp.dir, {
        multiArgs: true
    })({
        unsafeCleanup: true
    })
        .then((result) => {
            const [tmpPath, cleanupCallback] = result;

            webpackConfigBase.output.path = tmpPath;

            webpackConfigBase.plugins = [
                new WpCliWebpackPlugin([{
                    args: ['cli', 'version']
                }, {
                    args: ['cli', 'info'],
                    format: 'json'
                }], {
                    bin: wpCliBinPath,
                    maxConcurrency: 2
                })
            ];

            t.notThrows(pify(webpack)(webpackConfigBase));

            return cleanupCallback();
        })
);
