// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
const fs = require('fs');
const path = require('path');
const process = require('process');
const { downloadArtifact } = require('@electron/get');
const extract = require('extract-zip');
const pkg = require('../../package.json');

/*
This script replaces existing electron & chromedriver modules
with mirror dependencies specified by `assetNumber` and pipeline
build variables. We use this to avoid bundling non-freely-redistributable 
media codecs in our release builds. The version of Electron published to 
npm includes these as part of Chromium; our release builds use a 
Microsoft-maintained build of Electron that removes those codecs.
*/

if (
    process.env.ELECTRON_MIRROR_BASE_VAR === undefined ||
    process.env.ELECTRON_MIRROR_CUSTOM_DIR_VAR === undefined
) {
    console.error(
        `Mirror variables are not set. Please ensure that
        ELECTRON_MIRROR_BASE_VAR and ELECTRON_MIRROR_CUSTOM_DIR_VAR
        are both set as variables in the pipeline`,
    );
    process.exit(1);
}

const assetNumber = '6837137';

const displayFolderContents = (level, indent, folderToDisplay) => {
    if (level == 0) {
        console.log(`Contents of ${folderToDisplay}`);
    }
    const fileIndent = indent + '  ';
    const files = fs.readdirSync(folderToDisplay);
    files.forEach(file => {
        const fullPath = path.resolve(folderToDisplay, file);
        const stat = fs.statSync(fullPath);
        if (stat && stat.isDirectory()) {
            console.log(`${fileIndent}${file}  <==== Folder`);
            displayFolderContents(level + 1, fileIndent, fullPath);
        } else {
            console.log(`${fileIndent}${file}`);
        }
    });
    if (level == 0) {
        console.log('---------------------');
    }
};

const clearAndExtract = async (zipFilePath, destinationPath) => {
    destinationPath = path.resolve(destinationPath);

    console.log(`extracting to ${destinationPath}`);

    fs.rmdirSync(destinationPath, { recursive: true });

    await extract(zipFilePath, { dir: destinationPath });
    displayFolderContents(0, '', destinationPath);
};

const resolveCustomAssetURL = details => {
    const opts = details.mirrorOptions;
    const file = details.artifactName.startsWith('SHASUMS256')
        ? details.artifactName
        : `${[
              details.artifactName,
              details.version,
              details.platform,
              details.arch,
              details.artifactSuffix ? details.artifactSuffix : '',
          ].join('-')}.zip`.replace('-.', '.');
    const strippedVer = details.version.replace(/^v/, '');
    return `${opts.mirror}/${strippedVer}/${opts.customDir}/${assetNumber}/${file}`;
};

const downloadElectronArtifact = async (artifactName, artifactSuffix) => {
    const displaySuffix = artifactSuffix ? artifactSuffix : 'default';
    console.log(`downloading ${artifactName} (${displaySuffix}) at ${pkg.dependencies.electron}`);
    const zipFilePath = await downloadArtifact({
        version: `${pkg.dependencies.electron}`,
        artifactName,
        artifactSuffix,
        mirrorOptions: {
            mirror: process.env.ELECTRON_MIRROR_BASE_VAR,
            customDir: process.env.ELECTRON_MIRROR_CUSTOM_DIR_VAR,
            resolveAssetURL: resolveCustomAssetURL,
        },
        force: true,
    });
    console.log(`zip downloaded to dir ${zipFilePath}`);
    return zipFilePath;
};

exports.downloadAndExtractElectronArtifact = async (
    artifactName,
    destinationPath,
    aritifactType,
) => {
    const zipFilePath = await downloadElectronArtifact(artifactName, aritifactType);
    await clearAndExtract(zipFilePath, destinationPath);
};
