const express = require('express');
const path = require('path');
const { ScreenModel } = require('./DataBase/ScreenEntity');
const { setupDatabase, fetchAdvertismentByScreenId, fetchAllAdvertisment, fetchAllScreensData } = require('./MongoUtils');
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
    print(`Receive request from screen ID=${screenId} for advertisment data`);
    var screenAdvertisment;
    res.header("Access-Control-Allow-Origin", "*");

    if(screenId!=0){//if the request is from regular client
        var date = new Date();
        var isoDateTime = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString();

        await ScreenModel.updateOne({ _id: screenId }, { $set: { lastConnection: isoDateTime } });

        screenAdvertisment = await fetchAdvertismentByScreenId(screenId% SCREEN_NUMBER);
    }
    else{//if the request is from the admin client
        screenAdvertisment = await fetchAllAdvertisment();
    }
    print(`send ${screenAdvertisment.length} advertisment to the screen ID=${screenId}`);

    return res.json(screenAdvertisment);
});

/**
    Request example: /screens

    Return the screens data.
*/
server.get('/screens', async (req, res) => {

    print(`Receive request for screens data`);
    res.header("Access-Control-Allow-Origin", "*");
    
    const screens = await fetchAllScreensData();
    return res.json(screens);
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