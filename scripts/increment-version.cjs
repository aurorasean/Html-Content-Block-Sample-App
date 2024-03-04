// increment the version number in package.json
const fs = require('fs');
const path = require('path');
const packageJsonPath = path.join(__dirname, '..', 'package.json');

fs.readFile(packageJsonPath, 'utf8', (err, data) => {
    if (err) {
        throw err;
    }

    const packageJson = JSON.parse(data);
    const version = packageJson.version;
    const versionParts = version.split('.');
    const newVersion = `${versionParts[0]}.${versionParts[1]}.${parseInt(versionParts[2], 10) + 1}`;

    packageJson.version = newVersion;

    fs.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2), 'utf8', (err) => {
        if (err) {
            throw err;
        }
    });
});