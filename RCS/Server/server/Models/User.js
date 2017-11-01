var mongoose = require('mongoose');
var schema = mongoose.Schema;

var userSchema = new schema({
    _id: { type: schema.ObjectId, default: null },
    FirstName: String,
    LastName: String,
    ContactNumber: Number,
    Email: String,
    Password: String,
    IsActive: Boolean,
    IsDelete: Boolean
});

module.exports = mongoose.model('User', userSchema);