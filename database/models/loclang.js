const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const LocationLanguageSchema = new Schema({
    city:{type:[String], lowercase:true},
    language:{type:[String], lowercase:true}
});

const LocationLanguage = mongoose.model('loclangs', LocationLanguageSchema);

module.exports = LocationLanguage;