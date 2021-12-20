const express = require('express');
const path = require('path');
const { configuration } = require('./configuration')
const print = (data) => { console.log(data) };
const server = express();
const PORT = 3000;
const SCREEN_NUMBER = 3;

server.get('/', (req, res) => {

    const screenId = Number(req.query.id) % SCREEN_NUMBER;
    print('New connection from: ' + screenId);

    // Sending html page to the client
    const website = path.join(__dirname, "../client/index.html");
    return res.sendFile(website);
});

server.get('/config', (req, res) => {
    const screenId = Number(req.query.id) % SCREEN_NUMBER;

    const screenConfiguration = getPartialConfiguration(screenId);
    print("send configuration" + JSON.stringify(screenConfiguration));

    return res.json(JSON.stringify(screenConfiguration));
});

function parseConfiguration(config) {

    let arr = [];

    config.forEach((element) => {
        arr.push(element);
    });

    return arr;
}

function getPartialConfiguration(screenId) {
    const arrSize = configuration.length;

    let numOfGroups = 0;

    if (arrSize % SCREEN_NUMBER == 0) {
        numOfGroups = arrSize / SCREEN_NUMBER;
    }
    else {
        numOfGroups = (arrSize / SCREEN_NUMBER) + 1;
    }

    const startIndex = screenId * SCREEN_NUMBER;

    let endIndex = screenId * SCREEN_NUMBER + (SCREEN_NUMBER - 1);
    
    if (endIndex >= arrSize) {
        endIndex = arrSize - 1;
    }

    const configList = parseConfiguration(configuration);
    const screenConfiguration = configList.slice(startIndex, endIndex + 1);

    return screenConfiguration;
}

server.use(express.static('../client'));

server.listen(PORT, () => console.log(`server listening on port: ${PORT}`));