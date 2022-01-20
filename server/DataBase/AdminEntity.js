const mongoose = require('mongoose');

const AdminSchema = new mongoose.Schema({
    username: String,
    password: String
});

// Create model from the schema
const AdminModel = mongoose.model('Admins', AdminSchema);

module.exports = {
    AdminSchema,
    AdminModel
};