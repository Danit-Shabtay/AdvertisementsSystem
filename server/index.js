const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const { ScreenModel } = require('./DataBase/ScreenEntity');
const { setupDatabase, fetchAdvertismentByScreenId,findIfAdminExists, fetchAllAdvertisment, fetchAllScreensData } = require('./MongoUtils');
const PORT = 3000;
const SCREEN_NUMBER = 3;
const urlEncodedParser = bodyParser.urlencoded({ extended: false })
const print = (data) => { console.log(data) };
setupDatabase();
const server = express();
server.use(express.json())
server.use(cors());

server.get('/', (req, res) => {
    const screenId = Number(req.query.id);
    print(`New connection from screen ID=${screenId}`);
    ScreenModel.find({_id: screenId},function(err,result){

        if(result.length==0 && screenId!=0){//If this screen id is not already in the database and the id isn't admin-"0"
            var screen = new ScreenModel({ _id: screenId, lastConnection: null});
            screen.save();
        }
    });

    // Sending html page to the client
    if (Number(req.query.id) == 0)
    {
        website = path.join(__dirname, "../client/login.html");
    }
    else{
        website = path.join(__dirname, "../client/index.html");
    }
    return res.sendFile(website);
});
server.post('/check-admin',urlEncodedParser, async function(req,res){
    const psw =  req.body.psw;
    const userName = req.body.uname;
    const admins = await findIfAdminExists(userName,psw);
    if(admins.length==1){
        return res.json({isAdmin:true})
    } 
    else{
        return res.json({isAdmin:false})
    }
  });

  server.get('/admin', (req, res) => {
    website = path.join(__dirname, "../client/Admin.html");
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
        var isoDateTime = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString().slice(0,-1);

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
    server.use(express.static(__dirname +'/../client'));

/**
    Initiate the server to start listenting to client requests.
*/
server.listen(PORT, () => console.log(`server listening on port: ${PORT}`));