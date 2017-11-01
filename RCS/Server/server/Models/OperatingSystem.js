var mongoose = require('mongoose');
var schema = mongoose.Schema;

var operatingSystemSchema = new schema({
    OperatingSystemName: String,
    IsActive: Boolean,
    IsDelete: { type: Boolean, default: false }
});

module.exports = mongoose.model('OperatingSystem', operatingSystemSchema);