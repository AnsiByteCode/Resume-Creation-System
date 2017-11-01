var mongoose = require('mongoose');
var schema = mongoose.Schema;

var projectRoleSchema = new schema({
  ProjectRoleName: String,
  IsActive: Boolean,
  IsDelete: { type: Boolean, default: false }
});

module.exports = mongoose.model('ProjectRole', projectRoleSchema);