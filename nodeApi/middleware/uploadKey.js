const multer = require('multer')
const MAO = require('multer-aliyun-oss');
const Keys = require("../modules/keys")
let keysConfig = {}
let upload = Keys.findOne({bucket: 'coco727'}).then(key => {
    return multer({
      // dest: __dirname + '/../../uploads'
      storage: MAO({
        config: key
      })
    })
  })
  
module.exports = upload