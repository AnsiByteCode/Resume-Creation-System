var mongoose = require('mongoose');
var schema = mongoose.Schema;

var roleSchema = new schema({
  RoleName: String,
  IsActive: Boolean,
  IsDelete: { type: Boolean, default: false }
});

module.exports = mongoose.model('Role', roleSchema);