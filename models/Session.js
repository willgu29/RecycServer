var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SessionSchema = new Schema({
    
    id: {type: Number, required: true, unique: true},
    sessionName: {type: String, required: true},
    members: {},
    leader: {},
    dateCreated: {type: Date, default: Date.now}
});

// return the model

module.exports = Session = mongoose.model('Session', SessionSchema);