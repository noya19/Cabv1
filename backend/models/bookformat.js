const mongoose = require('mongoose')

const bookSchema = mongoose.Schema({
      tt : {type: String, required:true},
      pickup: {type: String, required:true},
      dest: {type: String, required:true},
      date: {type: String, required:true},
      time: {type: String, required:true},
      ct: {type: String, required:true},
      did: {type: String, required:true},
      dname : {type: String, required:true},
      status: {type: String, required:true},
      creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true}
})

module.exports = mongoose.model('Book', bookSchema)
