"use strict";

import minimist from 'minimist';
import * as path from 'path'
import * as fs from 'fs'
import * as os from 'os'
import * as child_process from 'child_process';

(async () => {
    const multinsUsage = `
kubectl multins [--help] | [--code] [--namespaces NAMESPACE1,NAMESPACE1] ....

comma separated (no space before or after commas) set of some of these options all, hooks, manifest, notes, values, templates

--code option specifies to use VSCode to show the output
--help show this help

TIP: To avoid passing --namespaces parameter every time, you can set an environment variable MULTINS_NAMESPACES with the comma separated list of namespaces you want to use.
`;

    let rest = process.argv.slice(2);
    let optsAndCommands = minimist(rest);

    if (optsAndCommands.help) {
        console.log(multinsUsage);
        return;
    }

    const code = optsAndCommands.code || false;

    let namespaces;
    if (process.env.MULTINS_NAMESPACES) {
        namespaces = process.env.MULTINS_NAMESPACES;
    }
    if (optsAndCommands.namespaces) {
        namespaces = optsAndCommands.namespaces;
    }
    if (namespaces) {
        namespaces = namespaces.split(',');
    } else {
        console.log(multinsUsage);
        return;
    }

    try {
        delete optsAndCommands.code;
        delete optsAndCommands.namespaces;

        let kubectlGet = `kubectl ${optsAndCommands._.join(' ')} `;
        Object.keys(optsAndCommands).forEach((option: string) => {
            if (option === '_') {
                return;
            }
            kubectlGet += `${option.length > 1 ? '--' : '-'}${option} ${optsAndCommands[option]}`;
        });

        namespaces.forEach(async (ns: string) => {
            const kubectlCommand = `${kubectlGet} -n ${ns}`;
            try {
                const kubectlCommandOutput = child_process.execSync(kubectlCommand, {
                    encoding: 'utf8'
                });
                if (kubectlCommandOutput) {
                    if (code) {
                        const kubectlCommandOutputFilePath = path.join(os.tmpdir(), `namespace-${ns}.txt`);
                        fs.writeFileSync(kubectlCommandOutputFilePath, kubectlCommandOutput);
                        child_process.execSync(`code -r ${kubectlCommandOutputFilePath}`);
                    } else {
                        console.info(kubectlCommandOutput);
                    }
                }
            } catch (e) {
                console.error(e);
                return;
            }
        });
    } catch (e) {
        console.error(e);
        return;
    }
})();
