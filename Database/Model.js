const mongoose = require('mongoose');

const odel = mongoose.Schema({

    name:{
           type:String,
           required:true
    },
    email:{
        type:String,
        required:true,

    },
    password:{
        type:String,
        required:true
    },
    cpassword:{
        type:String,
        required:true
    }
       
})

 const Model = mongoose.model('model',odel)
 module.exports = Model;