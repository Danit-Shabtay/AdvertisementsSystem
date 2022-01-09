const mongoose = require('mongoose');
const URL = "mongodb://127.0.0.1:27017/mydb";
const { configuration } = require('./configuration');
const { AdvertismentSchema } = require("./DataBase/AdvertismentEntity");

async function connectToDb(dbUrl) {
    return mongoose.connect(dbUrl);
}

async function dropCollection(collectionName) {
    return mongoose.connection.db.dropCollection(collectionName)
        .then(console.log(`Drop collection: ${collectionName}`));
}

async function setupDatabase() {
    await connectToDb(URL);
    await dropCollection("advertisments");
    
    insertConfiguration();
}

async function insertConfiguration() {
    
    // Create model from the schema
    const AdvertismentModel = mongoose.model('Advertisment', AdvertismentSchema);

    configuration.forEach((element) => {
        const tempAdvertisment = new AdvertismentModel(element);
        console.log(`Insert advertisment ${tempAdvertisment.name}`);
        tempAdvertisment.save();
    });   
}

module.exports = {
    setupDatabase
};

