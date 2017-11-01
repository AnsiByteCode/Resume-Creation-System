var mongoose = require('mongoose');
var schema = mongoose.Schema;

var domainSchema = new schema({
    DomainName: String,
    IsActive: Boolean,
    IsDelete: Boolean
});

module.exports = mongoose.model('Domain', domainSchema);