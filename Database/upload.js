

const mongoose = require('mongoose')

const upschema = new mongoose.Schema({

    userid:{
        type:String,
        required:true
    },
    Title:{
        type:String,
        required:true
    },
    Notes:{
        type:String,
        required:false
    },
    img:{
        type:String,
        required:true
    },
    date:{
    type:Date,
    default:Date.now()
    }
    
})

const upmodel =  mongoose.model('upload',upschema);

module.exports = upmodel;