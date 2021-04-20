// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
const path = require('path');
const fs = require('fs-extra');

const prepareBinskimDirLinux = async () => {
    const symbolsPath = path.resolve('analysis/binskim/files-to-scan');
    const productPath = path.resolve('drop/electron/unified-production/packed/linux-unpacked');

    await fs.copy(productPath, symbolsPath);
    await fs.rename(
        path.join(symbolsPath, 'accessibility insights for android'),
        path.join(symbolsPath, 'electron'),
    );

    console.log(`Symbols prepared in ${symbolsPath}`);
};

prepareBinskimDirLinux().catch(err => {
    console.error(err);
    process.exit(1);
});
