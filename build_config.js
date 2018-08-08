#!/usr/bin/env node

const fs = require('fs');

// If the `config.json` file does not yet exist, create it
if (!fs.existsSync('config.json')) {
    try {
        fs.writeFileSync('config.json', JSON.stringify({
            api_host: null
        }));
        console.log('Created `config.json` file');
    } catch (e) {
        console.error('Cannot write config file ', e);
        exit(1);
    }
}
