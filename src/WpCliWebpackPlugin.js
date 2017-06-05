import nodeify from 'nodeify';
import wpcli from 'wpcli';

export default class WordpressDebugWebpackPlugin {
    constructor(command, options = {}) {
        if (!command) {
            throw new Error('Require `command` argument');
        }

        this.command = command;
        this.options = Object.assign(
            {},
            {
                bin: './wp-cli.phar'
            },
            options
        );
    }

    apply(compiler) {
        compiler.plugin('after-emit', (compilerInstance, callback) => {
            let commands = this.command;

            if (!Array.isArray(commands)) {
                commands = [commands];
            }

            return nodeify(
                commands.reduce((current, next) => {
                    const bin = next.bin || this.options.bin;

                    return current.then(() =>
                        new Promise(resolve => {
                            if (!next.args) {
                                throw new Error(
                                    'Each command should have `args` argument'
                                );
                            }

                            if (!Array.isArray(next.args)) {
                                throw new Error(
                                    'Argument `args` of each command should be array'
                                );
                            }

                            return resolve();
                        }).then(() => wpcli(bin, [...next.args]))
                    );
                }, Promise.resolve()),
                error => callback(error)
            );
        });
    }
}
