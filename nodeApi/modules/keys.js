const mongoose  = require("mongoose")
const schema = new mongoose.Schema({
  region:{type: String},
  accessKeyId: {type: String},
  accessKeySecret: {type: String},
  bucket: {type: String}
},{
    timestamps: true
})
const KeysModel = mongoose.model('Keys', schema)

module.exports = KeysModel
