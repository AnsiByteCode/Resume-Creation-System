var mongoose = require('mongoose');
var schema = mongoose.Schema;

var databaseSchema = new schema({
    DatabaseName: String,
    IsActive: Boolean,
    IsDelete: Boolean
});

module.exports = mongoose.model('Database', databaseSchema);
