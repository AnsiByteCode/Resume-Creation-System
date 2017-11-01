var mongoose = require('mongoose');
var schema = mongoose.Schema;

var applicationSchema = new schema({
    ApplicationName: String,
    IsActive: Boolean,
    IsDelete: { type: Boolean, default: false }
});

module.exports = mongoose.model('Application', applicationSchema);