var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SessionIDSchema = new Schema({
    
    sessionID: {type: Schema.ObjectId, ref: 'Session'},
    code: {type: Number, required: true}
});

// return the model

module.exports = SessionID = mongoose.model('SessionID', SessionIDSchema);