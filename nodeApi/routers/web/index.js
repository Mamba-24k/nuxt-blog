module.exports = app => {
  const express = require("express")
  const router = express.Router({
    mergeParams: true
  })
  const Blogs = require("../../modules/blogs")
  const Comments = require("../../modules/comments")
  const Users = require("../../modules/users")
  const Messages = require("../../modules/messages")
  const Friends = require("../../modules/friends")
  const Tags = require("../../modules/tags")
  const apiLimiter = require("../../middleware/rateLimit")
  // 博文相关接口
  router.post('/web/blogs', async (req, res) => {
    let model = await Blogs.create(req.body)
    res.send(model)
  })
  router.post('/web/blogs/:pageNum/:pageSize', async (req, res) => {
    let model = {}
    let skip = (req.params.pageNum - 1) * req.params.pageSize
    if (req.body.tags) {
      model.total = await Blogs.count({tags: req.body.tags})
      model.rows = await Blogs.find(
        // {tags: req.body.tags},
        // {},
          // {
          //   sort: {
          //     createdAt: -1, //倒序 desc
          //   },
          //   skip: skip,//page : 当前页码, pageSize 每页显示条数
          //   limit: Number(req.params.pageSize)
          // }
        ).where({tags: req.body.tags}).populate('tags').skip(skip).sort({createdAt: -1,}).limit(Number(req.params.pageSize))
    } else {
      model.total = await Blogs.count()
      model.rows = await Blogs.find(
        ).populate('tags').skip(skip).sort({createdAt: -1,}).limit(Number(req.params.pageSize))
    }


    res.send(model)
  })
  router.get('/web/blogs/:id', async (req, res) => {
    let model = await Blogs.findById(req.params.id).lean()
    model.related = await Blogs.find().where({
      tags: { $in: model.tags }
    }).limit(2)
    await Blogs.update({_id : req.params.id}, {$inc : {views : 1}})

    res.send(model)
  })
  // 博文标签接口
  router.get('/web/tags', async (req, res) => {
    let model = await Tags.find()
    model.forEach(m => {
        m.value = m._id
    });
    res.send(model)
  })
  router.delete('/web/blogs/:id', async (req, res) => {
    let model = await Blogs.findByIdAndDelete(req.params.id)
    res.send(model)
  })
  router.put('/web/blogs/:id', async (req, res) => {
    let model = await Blogs.findByIdAndUpdate(req.params.id, req.body)
    res.send(model)
  })
  router.put('/web/blogs/likes/:id', async (req, res) => {
    let model = await Blogs.findByIdAndUpdate(req.params.id, 
      // { likes: req.body.likes },
      {$inc : {likes : 1}}
    )
    res.send(model)
  })
   // 用户相关接口
  router.post('/web/users', async (req, res) => {
    let model = await Users.create(req.body)
    res.send(model)
  })
  router.get('/web/users', async (req, res) => {
    let model = await Users.find()
    res.send(model)
  })
  router.put('/web/users/:id', async (req, res) => {
    let model = await Users.findByIdAndUpdate(req.params.id,req.body)
    res.send(model)
  })
  router.get('/web/users/:id', async (req, res) => {
    let model = await Users.findById(req.params.id)
    if (!model) {
      model = {
        isFind: false
      }
    }
    res.send(model)
  })
  // 发送邮件接口
  const sendEmail = require('../../pluglins/sendEmail.js')
  router.post('/web/email', async (req, res) => {
    sendEmail(req.body)
    res.send({ok: 'ok'})
  })

   // 评论相关接口
  router.post('/web/comments', apiLimiter,async (req, res) => {
    let model = await Comments.create(req.body)
    await Blogs.findByIdAndUpdate(req.body.relateBlogId, 
      // { msgs: req.body.msgs },
      {$inc : {msgs : 1}}
      )
    res.send(model)
  })
  router.get('/web/comments/:blogsId', async (req, res) => {
    const comments = await Comments.find().where({ relateBlogId: req.params.blogsId })
    res.send(comments.filter(v => v.isPass))
  })

  // 留言相关接口
  router.post('/web/messages', apiLimiter,async (req, res) => {
    let model = await Messages.create(req.body)
    res.send(model)
  })
  router.get('/web/messages', async (req, res) => {
    // console.log("123",await Blogs.findOne({
    //     _id: req.params.blogsId}))
    const messages = await Messages.find()
    res.send(messages.filter(v => v.isPass))
  })

  // web圈相关接口
  router.post('/web/friends', async (req, res) => {
    let model = await Friends.create(req.body)
    res.send(model)
  })
  router.get('/web/friends', async (req, res) => {
    let model = await Friends.find()
    res.send(model)
  })
  router.put('/web/friends/:id', async (req, res) => {
    let model = await Friends.findByIdAndUpdate(req.params.id,req.body)
    res.send(model)
  })

  // OSS云存储上传及文件管理相关接口
  const multer = require('multer')
  const MAO = require('multer-aliyun-oss');
  const config = require("../../pluglins/tranAccessKey")
  let newConfig = {}
  for (k in config) {
      newConfig[k] = config[k].replace(config['bucket'], '')
  }
  newConfig.bucket = config['bucket']
  const upload = multer({
    // dest: __dirname + '/../../uploads'
    storage: MAO({
      config: newConfig
    })
  })
  router.post('/web/upload', upload.single('file'), async (req, res) => {
    let file = req.file
    // file.url = `http://www.coco727.com/uploads/${file.filename}`
    res.send(file)
  })

  // 获取服务器时间
  router.get('/web/time', async (req, res) => {
    let time = new Date().getTime()
    res.send({'data': time})
  })
  app.use(router)
}
