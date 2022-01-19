const express = require('express');
const path = require('path');
const { setupDatabase, fetchAdvertismentByScreenId } = require('./MongoUtils');
const PORT = 3000;
const SCREEN_NUMBER = 3;

const print = (data) => { console.log(data) };

setupDatabase();

const server = express();

/**
    Return the html page to the client.
*/
server.get('/', (req, res) => {

    const screenId = Number(req.query.id) % SCREEN_NUMBER;
    print(`New connection from screen ID=${screenId}`);

    // Sending html page to the client
    const website = path.join(__dirname, "../client/index.html");
    return res.sendFile(website);
});

/**
    Request example: /advertisment?id=1

    Return the advertisment data to the screen.
    The query parameter: id, represent the screen ID.
*/
server.get('/advertisment', async (req, res) => {
    const screenId = Number(req.query.id) % SCREEN_NUMBER;

    print(`Receive request from screen ID=${screenId} for advertisment data`);

    const screenAdvertisment = await fetchAdvertismentByScreenId(screenId);
    print(`send ${screenAdvertisment.length} advertisment to the screen ID=${screenId}`);

    return res.json(screenAdvertisment);
});

/**
    Define the public directory of the system.
    Client request example: /client/img/1.jpg/
 */
server.use(express.static('../client'));

/**
    Initiate the server to start listenting to client requests.
*/
server.listen(PORT, () => console.log(`server listening on port: ${PORT}`));