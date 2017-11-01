var mongoose = require('mongoose');
var schema = mongoose.Schema;

var frameworkSchema = new schema({
    FrameworkName: String,
    IsActive: Boolean,
    IsDelete: { type: Boolean, default: false }
});

module.exports = mongoose.model('Framework', frameworkSchema);