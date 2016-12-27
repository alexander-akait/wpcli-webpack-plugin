import createThrottle from 'async-throttle';
import nodeify from 'nodeify';
import os from 'os';
import wpcli from 'wpcli';

export default class WordpressDebugWebpackPlugin {
    constructor(command, options = {}) {
        if (!command) {
            throw new Error('Require `command` argument');
        }

        this.command = command;
        this.options = Object.assign({}, {
            bin: './wp-cli.phar',
            maxConcurrency: os.cpus().length
        }, options);
    }

    apply(compiler) {
        compiler.plugin('after-emit', (compilerInstance, callback) => {
            let commands = this.command;

            if (!Array.isArray(commands)) {
                commands = [commands];
            }

            const maxConcurrency = this.options.maxConcurrency || os.cpus().length;
            const throttle = createThrottle(maxConcurrency);

            const commandsPromises = commands.map((wpCliCommand) => throttle(() => {
                const bin = wpCliCommand.bin || this.options.bin;

                if (!wpCliCommand.args) {
                    throw new Error('Each command should have `args` argument');
                }

                if (!Array.isArray(wpCliCommand.args)) {
                    throw new Error('Argument `args` of each command should be array');
                }

                return wpcli(bin, [...wpCliCommand.args]);
            }));

            return nodeify(Promise.all(commandsPromises), (error) => callback(error));
        });
    }
}
