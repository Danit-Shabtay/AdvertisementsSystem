const mongoose = require('mongoose');

const ScreenSchema = new mongoose.Schema({
    screenId: Number,
    lastConnection: Date
});

// Create model from the schema
const ScreenModel = mongoose.model('Screens', ScreenSchema);

module.exports = {
    ScreenSchema,
    ScreenModel
};