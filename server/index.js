const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const { ScreenModel } = require("./DataBase/ScreenEntity");
const {
  setupDatabase,
  fetchAdvertismentByScreenId,
  findIfAdminExists,
  fetchAllAdvertisment,
  fetchAllScreensData,
  changeTheAdminLoginDetails,
} = require("./MongoUtils");
const {
  deleteAdvertismentById,
  updateAdvertismentById,
  addAdvertisment,
} = require("./Services/AdvertismentService");

const PORT = 3000;
const SCREEN_NUMBER = 3;
const urlEncodedParser = bodyParser.urlencoded({ extended: false });
const print = (data) => {
  console.log(data);
};
setupDatabase();
const jwt = require("jsonwebtoken");
const server = express();
server.use(express.json());
server.use(cors());

//new token
const checkToken = async (req, res, next) => {
  let token = req.header("x-api-key");
  if (!token) return res.status(401).json({ error: "you must send token" });
  try {
    let verify = await jwt.verify(token, "SECRET");
    next();
  } catch (error) {
    return res.status(401).json({ error: "something went wrong" });
  }
};

server.get("/token", checkToken, function (req, res) {
  res.json({ token: true });
});

server.get("/connect", function (req, res) {
  const screenId = Number(req.query.id);
  req.on("close", async function () {
    //When a screen client will leave the server web
    console.log(
      `Screen NO."${screenId}" has closed the connection with the server`
    );
    await ScreenModel.updateOne(
      { _id: screenId },
      { $set: { isOnline: false } }
    );
  });
});

server.get("/", (req, res) => {
  const screenId = Number(req.query.id);
  print(`New connection from screen ID=${screenId}`);
  ScreenModel.find({ _id: screenId }, async function (err, result) {
    if (result.length == 0 && screenId != 0) {
      //If this screen id is not already in the database and the id isn't admin-"0"
      var screen = new ScreenModel({
        _id: screenId,
        lastConnection: null,
        isOnline: true,
      });
      screen.save();
    } else if (result.length != 0) {
      //If this screen id is not already in the database
      await ScreenModel.updateOne(
        { _id: screenId },
        { $set: { isOnline: true } }
      );
    }
  });

  // Sending html page to the client
  if (Number(req.query.id) == 0) {
    website = path.join(__dirname, "../client/login.html");
  } else {
    website = path.join(__dirname, "../client/index.html");
  }
  return res.sendFile(website);
});

server.post("/check-admin", urlEncodedParser, async function (req, res) {
  const psw = req.body.psw;
  const userName = req.body.uname;
  const admins = await findIfAdminExists(userName, psw);
  if (admins.length == 1) {
    let newToken = jwt.sign({ _id: admins[0]._id }, "SECRET", {
      expiresIn: "30d",
    });
    return res.json({ isAdmin: true, token: newToken, userName: userName });
  } else {
    return res.json({ isAdmin: false });
  }
});

server.get("/admin", (req, res) => {
  website = path.join(__dirname, "../client/Admin.html");
  return res.sendFile(website);
});

server.get("/changePassword", (req, res) => {
  website = path.join(__dirname, "../client/changePassword.html");
  return res.sendFile(website);
});

/**
    Request example: /advertisment?id=1

    Return the advertisment data to the screen.
    The query parameter: id, represent the screen ID.
*/
//check token,
server.get("/advertisment", async (req, res) => {
  const screenId = Number(req.query.id);
  print(`Receive request from screen ID=${screenId} for advertisment data`);
  var screenAdvertisment;
  if (screenId != 0) {
    //if the request is from regular client
    var date = new Date();
    var isoDateTime = new Date(
      date.getTime() - date.getTimezoneOffset() * 60000
    )
      .toISOString()
      .slice(0, -1);

    await ScreenModel.updateOne(
      { _id: screenId },
      { $set: { lastConnection: isoDateTime } }
    );

    screenAdvertisment = await fetchAdvertismentByScreenId(
      screenId % SCREEN_NUMBER
    );
  } else {
    //if the request is from the admin client
    screenAdvertisment = await fetchAllAdvertisment();
  }
  print(
    `send ${screenAdvertisment.length} advertisment to the screen ID=${screenId}`
  );

  return res.json(screenAdvertisment);
});

/**
    Request example: /advertisment?id=62055b4e53ff4639d55efd6c

    Delete the advertisment from DB.
*/
// TODO: check token
server.delete("/advertisment", async (req, res) => {
  const advertismentId = req.query.id;

  await deleteAdvertismentById(advertismentId);

  print(`Delete advertisment ID=${advertismentId}`);

  return res.sendStatus(200);
});

/**
    Request example: /advertisment?id=62055b4e53ff4639d55efd6c

    Update the advertisment in DB.
*/
// TODO: check token
server.put("/advertisment", async (req, res) => {
  const advertismentId = req.query.id;
  const advertismentDataToUpdate = req.body.advertismentData;

  await updateAdvertismentById(advertismentId, advertismentDataToUpdate);

  print(
    `Update advertisment ID=${advertismentId} with data:${JSON.stringify(
      advertismentDataToUpdate
    )}`
  );

  return res.sendStatus(200);
});

/**
    Request example: /advertisment

    Add new advertisment to the system.
*/
// TODO: check token
server.post("/advertisment", async (req, res) => {
  const advertismentDataToAdd = req.body.advertismentData;

  await addAdvertisment(advertismentDataToAdd);

  print(
    `Add new advertisment with data: ${JSON.stringify(advertismentDataToAdd)}`
  );

  return res.sendStatus(200);
});

server.get("/adminAd", checkToken, async (req, res) => {
  const screenId = Number(req.query.id);
  print(`Receive request from screen ID=${screenId} for advertisment data`);
  var screenAdvertisment;
  if (screenId != 0) {
    //if the request is from regular client
    var date = new Date();
    var isoDateTime = new Date(
      date.getTime() - date.getTimezoneOffset() * 60000
    )
      .toISOString()
      .slice(0, -1);

    await ScreenModel.updateOne(
      { _id: screenId },
      { $set: { lastConnection: isoDateTime } }
    );

    screenAdvertisment = await fetchAdvertismentByScreenId(
      screenId % SCREEN_NUMBER
    );
  } else {
    //if the request is from the admin client
    screenAdvertisment = await fetchAllAdvertisment();
  }
  print(
    `send ${screenAdvertisment.length} advertisment to the screen ID=${screenId}`
  );

  return res.json(screenAdvertisment);
});

/**
    Request example: /screens 
    Return the screens data.
*/
server.get("/screens", checkToken, async (req, res) => {
  print(`Receive request for screens data`);

  const screens = await fetchAllScreensData();
  return res.json(screens);
});

//call function that update database , afterward check if the update was successful if it was get a new token
server.post(
  "/changePassword",
  checkToken,
  urlEncodedParser,
  async function (req, res) {
    const psw = req.body.psw;
    const userName = req.body.uname;
    await changeTheAdminLoginDetails(userName, psw);
    const admins = await findIfAdminExists(userName, psw);
    if (admins.length == 1) {
      let newToken = jwt.sign({ _id: admins[0]._id }, "SECRET", {
        expiresIn: "30d",
      });
      return res.json({ isAdmin: true, token: newToken, userName: userName });
    } else {
      return res.json({ isAdmin: false });
    }
  }
);

/**
    Define the public directory of the system.
    Client request example: /client/img/1.jpg/
 */
server.use(express.static(__dirname + "/../client"));

/**
    Initiate the server to start listenting to client requests.
*/
server.listen(PORT, () => console.log(`server listening on port: ${PORT}`));
