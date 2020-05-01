const express = require('express')
const Book = require('../models/bookformat');
const checkauth = require('../middleware/check-auth');
const router = express.Router();

//this part is for adding bookings into the booking id
router.post("",checkauth,(req, res, next) => {       //this means post requeest sent to "/api/driver"

const book = new Book({
  tt : req.body.tt,
  pickup: req.body.pickup,
  dest: req.body.dest,
  date: req.body.date,
  time: req.body.time,
  ct:  req.body.ct,
  did: req.body.did,
  dname : req.body.dname,
  status: req.body.status,
  creator: req.userData.userId
  });
  book.save().then(bookingid =>{
    console.log(book);
    res.status(201).json({
    message: "Booked Successfully",
    bookid: bookingid._id
    });

  }).catch(err =>{
    res.status(500).json({
      message: 'booking failed!'
    });
  });
});

router.get("/:id",checkauth,(req, res, next) => {
  Book.find({creator: req.params.id}).then(Responsedata => {
    if (Responsedata){
      res.status(200).json({
        message: "Bookings Found",
        bk: Responsedata
      });
    }
    else{
      res.status(404).json({message: 'Bookings not found' });
    }
  }).catch(err => {
    console.log(err)
    res.status(500).json({message: "Something Went Wrong"});
  });
});
module.exports = router;
