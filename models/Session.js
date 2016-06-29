var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SessionSchema = new Schema({
    
    sessionId: {type: Number, required: true, unique: true},
    sessionName: {type: String, required: true},
    members: [{type: Schema.ObjectId, ref: 'User'}],
    leader: {type: Schema.ObjectId, ref: 'User'},
    dateCreated: {type: Date, default: Date.now}
});

// return the model

module.exports = Session = mongoose.model('Session', SessionSchema);