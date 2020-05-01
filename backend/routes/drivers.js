const express = require('express');
const multer = require('multer');
const Driver = require('../models/driver');
const checkauth = require('../middleware/check-auth');


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

// this is to add driver and receive driver list
router.post("", multer({storage: storage}).single("image"), (req, res, next) => {       //this means post requeest sent to "/api/driver"
const url = req.protocol + '://' + req.get("host");
const driver = new Driver({
  name: req.body.name,
  phone: req.body.phone,
  email: req.body.email,
  ctype: req.body.ctype,
  cname: req.body.cname,
  plate: req.body.plate,
  rating: req.body.rating,
  imagePath: url + "/images/" +req.file.filename
  });
  driver.save();
  console.log(driver);
  res.status(201).json({
    message: "Driver Successfully added"
  });
});

router.get("",checkauth,(req, res, next) => {
  Driver.find().then(Responsedata => {
    res.status(200).json({
      message: 'info fetched Correctly!',
      dvr: Responsedata
    });
  });
});

module.exports = router;
