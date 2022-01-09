const mongoose = require('mongoose');

/*
    // Example for creating one single element and save it in the database
    const advertisment1 = new AdvertismentModel({ 
        name: "lslsl",
        template: "A",
        length: 1,
        //timeFrame: timeFrame,
        images: ["lala"],
        text: ["lalala"]
    });
    
    // Example of savng the entity to the database
    advertisment1.save();
*/

const AdvertismentSchema = new mongoose.Schema({
    name: String,
    template: String,
    length: Number,
    //timeFrame: timeFrame,
    images: [String],
    text: [String]
});

module.exports = {
    AdvertismentSchema
};