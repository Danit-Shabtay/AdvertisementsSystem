const mongoose = require('mongoose');
const DATABASE_URL = "mongodb://127.0.0.1:27017/mydb";
const { configuration, admins } = require('./configuration'); // configuration = Array of Advertisments
const { AdvertismentModel } = require("./DataBase/AdvertismentEntity");
const { AdminModel } = require("./DataBase/AdminEntity");
const e = require('express');

/**
    Establish connection with the database using it's URL address.
*/
async function connectToDb(databaseUrl) {
    return mongoose.connect(databaseUrl);
}

/**
    Initialize the database according to the requierments:
    1. Establish connection with the database
    2. Drop any exsiting collection & data
    3. Create the requiered collection & fill them with data

    This function should be called only once when starting the server.
*/
async function setupDatabase() {
    await connectToDb(DATABASE_URL);
    await mongoose.connection.db.dropDatabase();
    
    insertAdvertismentData();
    insertAdminData();

}

/**
 * Fetch advertisment data by advertisment name.
 * @param {*} advertismentName Name of the advertisment
 * @returns Advertisment data.
 */
async function fetchAdvertismentByName(advertismentName) {
    // SELECT FROM Advertisment
    // WHERE Name = advertismentName
    return AdvertismentModel.find({
        name: advertismentName
    });
}

/**
 * Fetch advertisment data by advertisment screenID.
 * @param {*} screenId Name of the advertisment
 * @returns Advertisment data.
 */
async function fetchAdvertismentByScreenId(screenId) {
    // SELECT FROM Advertisment
    // WHERE ScreenId = screenId
    return AdvertismentModel.find({
        screenId: screenId
    });
}

/**
 * TODO
 * @param {*} userDetails 
 */
async function addUser(userDetails) {
    /*
    1. Create UserSchema
    2. Create UserModel from UserSchema

    3. Create object & fill it with data:
    let userToAdd = new UserModel({
    username: ....,
    screenId: ...,
    lastConnectionTimetamp: ....,
    .....
    })

    4. save the new user to the DB:
    userToAdd.save()
    .then(doc => {
        console.log(doc)
    })
    .catch(err => {
        console.error(err)
    })
    */
}

/**
    Read the local data of the builtin advertisment
    and saves them to the database.
*/
async function insertAdvertismentData() {
    configuration.forEach((element) => {
        const tempAdvertisment = new AdvertismentModel(element);
        console.log(`Insert new advertisment, ID=${tempAdvertisment._id}`);
        tempAdvertisment.save();
    });

}

/**
    Read the local data of the admins
    and saves them to the database.
*/
async function insertAdminData() {
    admins.forEach((element) => {
        const tempAdmin = new AdminModel(element);
        console.log(`Insert new admin, ID=${tempAdmin._id}`);
        tempAdmin.save();
    });
       
}


// async function adminExistsInDb(adminName) {
//     // SELECT FROM Advertisment
//     // WHERE Name = advertismentName
     
//         admins.forEach((element) => {
//             const tempAdmin = new AdminModel(element);
//             console.log(`Insert new admin, ID=${tempAdmin._id}`);
//             tempAdmin.save();
//         });
           
//     }

// async function findIfAdminExists(adminName,password) {
//     // SELECT FROM Advertisment
//     // WHERE Name = advertismentName
//     AdminModel.find({
//         username: adminName,
//         password: password
//     }, function(err,result){
//         // console.log(result)
//         if (result.length == 1)
//         {
//               return true;;
//         }
//         console.log("insid  ");
//         return false;
//     })
        
//     }

async function findIfAdminExists(adminName,password) {
    // SELECT FROM Advertisment
    // WHERE Name = advertismentName
    return AdminModel.find({
        username: adminName,
        password: password
    });
}

module.exports = {
    setupDatabase,
    fetchAdvertismentByName,
    fetchAdvertismentByScreenId,
    findIfAdminExists
};