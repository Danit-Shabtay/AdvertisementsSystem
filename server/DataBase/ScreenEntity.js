const mongoose = require('mongoose');

const ScreenSchema = new mongoose.Schema({
    _id: Number,
    lastConnection: String
});

// Create model from the schema
const ScreenModel = mongoose.model('Screens', ScreenSchema);

module.exports = {
    ScreenSchema,
    ScreenModel
};