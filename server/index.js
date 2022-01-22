const express = require('express');
const path = require('path');
const { ScreenModel } = require('./DataBase/ScreenEntity');
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

    const screenId = Number(req.query.id);
    print(`New connection from screen ID=${screenId}`);

    ScreenModel.find({_id: screenId},function(err,result){

        if(result.length==0){//if this screen id is not in the database
            var screen = new ScreenModel({ _id: screenId, lastConnection: null});
            screen.save();
        }
    });

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
    const screenId = Number(req.query.id);

    var date = new Date();
    var isoDateTime = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString();

    await ScreenModel.updateOne({ _id: screenId }, { $set: { lastConnection: isoDateTime } });

    print(`Receive request from screen ID=${screenId} for advertisment data`);

    const screenAdvertisment = await fetchAdvertismentByScreenId(screenId% SCREEN_NUMBER);
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