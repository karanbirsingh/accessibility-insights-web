// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const core = require('./run-binskim-core');

core.runBinSkimWindows().catch(err => {
    console.error(err);
    process.exit(1);
});