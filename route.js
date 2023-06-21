const express = require('express')
const jwt = require('jsonwebtoken');
const app = express.Router();
const middleware = require('./Middleware');
const upmodel = require('./Database/upload');
const model = require('./Database/Model');
const cors = require('cors');
const path =require('path')
const { models } = require('mongoose');
app.use(cors ({
  origin:'*'
}))

app.use(express.urlencoded({ extended :false}));

//multer for  uploading the file images from local storage
const multer = require('multer');
const storage = multer.diskStorage({
  destination: (req,file,cb) =>{
           cb(null,'images')
          },
        filename: (req,file,cb) =>{
          console.log(file) 
          cb(null, Date.now() + path.extname(file.originalname))
        }  
})

const up =  multer({storage:storage})
 
app.post('/imgupload',up.single("image"),(req,res) =>{

     res.send("image is uploaded")
})






app.get('/hello',(req,res)=>{
    console.log("Hello World");
    return res.send("hello world is ruuning");
})
//register

app.post('/register',async (req,res) =>{
   
  const {name,email,password,cpassword} = req.body;

  let exist = await model.findOne({email})

  if(exist){
     
       return res.json({msg:'email already exists'});

  }
  if(password !== cpassword)
  {
       return res.json({msg:'password do not matches'})
  }
//object creation
  let data = new model({
   name : name,
   email:email,
   password:password,
   cpassword:cpassword,
        
  })

  await data.save().then(
    (da) =>{ return res.status(200).json({msg:"registered successfully"}) }

  ).catch( (err) =>{
    console.log(err);
  }
  )
  

})

//login
app.post('/login',async(req,res)=>{

      const {email,password} = req.body;

      if(!(email && password))
      {
        return res.send("input is required");
      }

      const user = await model.findOne({email})
       console.log(user);
      if(user==null)
      {
        return res.send("user not found");
      }

      if(email!=user.email)
      {
        res.send("Email does not match");
      }
      if(password!=user.password)
      {
        res.send("password does not match");
      }

      let payload = {
        user:{
           id:user.id
        }
      }
      const token = jwt.sign(payload,"health",{expiresIn:9999999999999},(err,token)=>{
         if(err)
         {
          res.send(err);
         }
         else
         {
             res.json({"token":token})
         }
      })

      

})




//uploading file
app.post('/upload',async (req,res)=>{
    console.log(req.body)
    const tk = req.header('token')
    console.log(tk)
 
    const ar = jwt.verify(tk,"health")
    console.log(ar.user.id)
     const id = ar.user.id
   console.log(id)
    
if(tk!=null)
{
  const {userid,Title,Notes,img,date} =req.body;

    const data = new upmodel({
        userid:userid,
        Title:Title,
        Notes:Notes,
        img:img,
        date:date
    });
   await data.save();

   return res.send("successfully created a storage");
  }
  else{
    console.log("error")
    res.send("no token is present")
  }
})

//getting data
app.get('/data',async(req,res)=>{
      const alldata = await upmodel.find();
      return res.send(alldata);
})

//updating data


//delete data
app.delete('/del/:id',async(req,res)=>{
  try{
         await upmodel.findByIdAndDelete(req.params.id)
          return res.send("successfully deleted..");
  }
  catch(err){
    console.log(err);
  }
})

//view data
app.get('/view/:id',async(req,res)=>{
     try{
      const alldata = await upmodel.findById(req.params.id);
      return res.send(alldata);
     }
     catch(err){
      console.log(err)
     }
})
//images 

app.get('/image/:id',async(req,res)=>{
    
    const data = await upmodel.findById(req.params.id);

       return res.send(data.img);
})


//update
app.put('/update/:id',async(req,res)=>{

  const{Title,Notes,img} = req.body;
  const data = await upmodel.findByIdAndUpdate(req.params.id,{
     Title:Title,
     Notes:Notes,
     img:img
  });
   
  await data.save();
   
     res.send("successfully updated");
   
        
})
//decode
app.get('/decode/:tok',async(req,res)=>{
  const exist = jwt.verify(req.params.tok,"health");
  const dat = await model.findById(exist.user.id);
  console.log(dat);
  res.send(dat)
})




//data_separately
app.get('/get/:id',async(req,res)=>{
      const d = req.params.id;
      const ar = jwt.verify(d,"health")
      console.log(ar.user.id)
       const id = ar.user.id
      const bdata = await upmodel.find({userid:id})
      console.log(bdata);
      res.json(bdata)

})
module.exports = app;