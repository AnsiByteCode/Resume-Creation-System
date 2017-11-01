var mongoose = require('mongoose');
var schema = mongoose.Schema;

var languageSchema = new schema({
    LanguageName: String,
    IsActive: Boolean,
    IsDelete: { type: Boolean, default: false }
});

module.exports = mongoose.model('Language', languageSchema);