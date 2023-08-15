const mongoose = require('mongoose');

const emailMsgSchema = mongoose.Schema({
    fromEmail: {
        type: String,
        required: true
    },
    toEmail: {
        type: String,
        required:true
    },
    message: {
        type: String,
       required:true 
    },
    subject: {
        type: String,
       required:true 
    },
    sentBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required:true 
    }

},{timestamp:true})

const EmailMsg = mongoose.model("EmailMsg", emailMsgSchema);

module.exports = EmailMsg;