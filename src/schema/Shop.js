const mongo = require('mongoose');

module.exports = mongo.model('Shop', new mongo.Schema({
    id: String,
    name: String,
    price: Number,
    description: String
}, {
    versionKey: false
}))