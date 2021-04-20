// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const core = require('./download-electron-mirror-core');

const downloadMirrorSymbolsLinux = async () => {
    await core.downloadAndExtractElectronArtifact(
        'electron',
        'analysis/binskim/files-to-scan',
        'dbg',
    );
};

downloadMirrorSymbolsLinux().catch(err => {
    console.error(err);
    process.exit(1);
});
