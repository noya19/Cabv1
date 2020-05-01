const express = require('express');
const User = require('../models/user');
const multer = require('multer');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const checkauth = require('../middleware/check-auth')


const router = express.Router();

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg'
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mime Type");
    if(isValid)
    {
      error = null;
    }
    cb(null, "backend/images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(' ').join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + '-' + Date.now() + '.' + ext);
  }
});

router.post("/signup",multer({storage: storage}).single("image"), (req, res, next) => {
  const url = req.protocol + '://' + req.get("host");
  bcrypt.hash(req.body.password, 10)
.then(hash => {
        const user = new User({
          name: req.body.name,
          phone: req.body.phone,
          email: req.body.email,
          password: hash,
          imagePath: url + "/images/" +req.file.filename
        });
        user.save().then(result => {
          res.status(201).json({
              message: 'User Created',
              result: result
          });
        })
        .catch(err =>{
          res.status(500).json({
            message: "Invalid authentication Credentials!"
          });
        });
      });
  });

router.post("/login", (req,res, next) =>{
  let fetchedUser;
  User.findOne({email: req.body.email})
  .then(user => {
    if(!user)
    {
      res.status(401).json({ message: "Invalid User"});
    }
    fetchedUser= user;
    return bcrypt.compare(req.body.password, user.password);
  })
  .then(result => {
    if(!result)
    {
      res.status(401).json({ message: "Invalid Credentials"});
    }
    const token =jwt.sign({email: fetchedUser.email, userid: fetchedUser._id}, 'this_is_a_password', {expiresIn: "1h"});
    res.status(200).json({ token: token , expiresIn: 3600 ,id: fetchedUser._id});
  })
  .catch(err =>{
    return res.status(401).json({ message: "Invalid Credentials" });
  });
});

router.get("/:id",checkauth,(req, res, next) => {
  User.find({_id: req.params.id}).then(Responsedata => {
    if (Responsedata){
      res.status(200).json({
        message: "User Found",
        usr: Responsedata
      });
    }
    else{
      res.status(404).json({message:"User not found"});
    }
  }).catch(err => {
    console.log(err)
    res.status(500).json({message: "User not found"});
  });
});

module.exports = router;
