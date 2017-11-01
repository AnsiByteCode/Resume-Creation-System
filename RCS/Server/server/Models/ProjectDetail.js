var mongoose = require('mongoose');
var schema = mongoose.Schema;

var projectDetailSchema = new schema({
    CandidateId: schema.ObjectId,
    ProjectId: schema.ObjectId,
    RoleId:schema.ObjectId,
    Responsibilities: String,
}, function(err, data) { // <-- this is the callback you pass
  // here you handle the results of saving the model
});

module.exports = mongoose.model('ProjectDetail', projectDetailSchema);
