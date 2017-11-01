var mongoose = require('mongoose');
var schema = mongoose.Schema;

var designationSchema = new schema({
    DesignationName: String,
    IsActive: Boolean,
    IsDelete: Boolean
});

module.exports = mongoose.model('Designation', designationSchema);
