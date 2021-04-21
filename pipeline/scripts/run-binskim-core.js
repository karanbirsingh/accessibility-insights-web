// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
const child_process = require('child_process');
const path = require('path');
const fs = require('fs-extra');

const runBinSkimFromConfig = async config => {
    const binSkimDir = path.resolve('analysis/binskim');
    const fileTarget = path.resolve(binSkimDir, 'files-to-scan', config.fileTargetFilter);
    const toolsDir = path.resolve(binSkimDir, 'tools');
    const logDir = path.resolve(binSkimDir, 'logs');
    const logFile = path.resolve(logDir, config.outputFile);

    const files = fs.readdirSync(toolsDir);

    files.forEach(file => {
        if (file.startsWith('Microsoft.CodeAnalysis.BinSkim')) {
            console.log(`found ${file}`);
            const pathToToolBinary = path.resolve(
                toolsDir,
                file,
                'tools',
                'netcoreapp3.1',
                config.toolPlatform,
                config.toolBinaryName,
            );
            if (fs.existsSync(pathToToolBinary)) {
                foundFile = true;
                if (config.markToolAsExecutable) {
                    fs.chmodSync(pathToToolBinary, '755');
                }
                fs.mkdirSync(logDir, { recursive: true });
                child_process.execFileSync(
                    pathToToolBinary,
                    ['analyze', fileTarget, '--recurse', '--output', logFile],
                    {
                        stdio: ['pipe', process.stdout, process.stderr],
                    },
                );

                return;
            }
        }
    });

    throw new Error(`Could not find ${config.toolBinaryName}`);
};

exports.runBinSkimWindows = async () => {
    runBinSkimFromConfig({
        fileTargetFilter: '*.*',
        toolPlatform: 'win-x64',
        toolBinaryName: 'BinSkim.exe',
        markToolAsExecutable: false,
        outputFile: 'binskim.windows.sarif',
    });
};

exports.runBinSkimLinux = async () => {
    runBinSkimFromConfig({
        fileTargetFilter: 'electron',
        toolPlatform: 'linux-x64',
        toolBinaryName: 'BinSkim',
        markToolAsExecutable: true,
        outputFile: 'binskim.linux.sarif',
    });
};
