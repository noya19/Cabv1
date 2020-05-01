const mongoose = require('mongoose')

const dvrSchema = mongoose.Schema({
  name: {type: String, required:true},
  phone:{type: String, required:true},
  email: {type: String, required:true},
  ctype: {type: String, required:true},
  cname: {type: String, required:true},
  plate: {type: String, required:true},
  rating:{type: String, default: "5"},
  imagePath: {type: String, required: true}
})


module.exports = mongoose.model('Driver', dvrSchema)
