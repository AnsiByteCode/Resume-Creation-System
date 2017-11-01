var mongoose = require('mongoose');
var schema = mongoose.Schema;

var technologySchema = new schema({
    TechnologyName: String,
    IsActive: Boolean,
    IsDelete: { type: Boolean, default: false }
});

module.exports = mongoose.model('Technology', technologySchema);