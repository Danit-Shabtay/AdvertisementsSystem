const mongoose = require('mongoose');

/*
    // Example for creating one single element and save it in the database
    const advertisment1 = new AdvertismentModel({ 
        name: "lslsl",
        template: "A",
        length: 1,
        timeFrame: {...},
        images: ["lala"],
        text: ["lalala"]
    });
    
    // Example of savng the entity to the database
    advertisment1.save();
*/

const AdvertismentSchema = new mongoose.Schema({
    screenId: Number,
    name: String,
    template: String,
    length: Number,
    timeFrame: [
        {
            dates: {
                start: Date,
                end: Date
            },
            days: [Number],
            time: {
                start: Date,
                end: Date
            }
        }
    ],
    images: [String],
    text: [String]
});

// Create model from the schema
const AdvertismentModel = mongoose.model('Advertisment', AdvertismentSchema);

module.exports = {
    AdvertismentSchema,
    AdvertismentModel
};