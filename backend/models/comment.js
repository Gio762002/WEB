//model/comment.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// create new instance of the mongoose.schema. the schema takes an
// object that shows the shape of your database entries.
const TestSchema = new Schema({
    name: String,
}, { timestamps: true, collection: 'test'});
const test = mongoose.model('test', TestSchema);
module.exports = test 
