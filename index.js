const express = require('express');
const app =express();

app.use(express.json());  //middleware or body parser
app.use(require('./route'))
require('./Database/connect');
app.listen(5000,(req,res)=>{
    console.log("port is running on 5000");
})













