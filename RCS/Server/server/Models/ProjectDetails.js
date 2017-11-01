var mongoose = require('mongoose');
var schema = mongoose.Schema;

var projectDetailsSchema = new schema({
    _id: { type: schema.ObjectId, default: null },
    CandidateId: schema.ObjectId,
    ProjectId: schema.ObjectId,
    RoleId: schema.ObjectId,
    Responsibilities: String
});

module.exports = mongoose.model('ProjectDetails', projectDetailsSchema);