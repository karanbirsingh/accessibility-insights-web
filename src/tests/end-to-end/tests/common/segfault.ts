// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
export default function (): void {
    const SegfaultHandler = require('segfault-handler');
    SegfaultHandler.registerHandler('crash.log');
    console.log('setting up');
}
