module.exports = app => {
    const express = require("express")
    const Admins = require('../../modules/admins.js')
    const jwt = require('jsonwebtoken')
    const assert = require('http-assert')
    const router = express.Router({
        mergeParams: true
    })
    const authMiddleware = require("../../middleware/auth")
    // 新增
    router.post('/', async(req,res) => {
        let model = await req.module.create(req.body)
        res.send(model)
    })
    // 查询得到List
    router.get('/', async (req,res) => {
        let model = await req.module.find().populate('parent tags')
        if (req.params.resource === 'tags') {
            console.log('进来')
            model.forEach(m => {
                m.value = m._id
            });
        }
        res.send(model)
    })
    // 根据id查询得到某一项
    router.get('/:id', async (req,res) => {
        let model = await req.module.findById(req.params.id)
        res.send(model)
    })
    // 根据id查询并删除
    router.delete('/:id', async (req,res) => {
        let model = await req.module.findByIdAndDelete(req.params.id)
        res.send(model)
    })
    // 根据id查询并修改更新
    router.put('/:id', async (req,res) => {
        let model = await req.module.findByIdAndUpdate(req.params.id,req.body)
        res.send(model)
    })
    // 以上所有数据模块的增删改查接口路径的通用入口
    app.use('/admin/rest/:resource', authMiddleware(app), async (req, res, next) => {
        console.log(req.params.resource)      
        req.module = require(`../../modules/${req.params.resource}`)
        next()
    }, router)

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
    let OSS = require('ali-oss')

    let client = new OSS(newConfig);
    app.post('/admin/upload', authMiddleware(app), upload.single('file'), async (req,res) => {
        let file = req.file
        // file.url = `http://www.coco727.com/uploads/${file.filename}`
        res.send(file)
    })
    app.get('/admin/ossList', authMiddleware(app), async (req,res) => {
        let result = await client.list();
        res.send(result)
    })
    app.delete('/admin/ossList/:name', authMiddleware(app), async (req,res) => {
        let result = await client.delete(req.params.name);
        res.send(result)
    })
    // admin管理员账号登陆
    app.post('/admin/login',async (req, res) => {
        const {username, password} = req.body
        // 查找用户是否存在
        const user = await Admins.findOne({username: username}).select('+password')
        assert(user, 422, '用户名不存在')
        // if (!user) {
        //     return res.status(422).send({message: '用户名不存在'})
        // }
        // 检验密码是否正确
        const isCheck = require('bcrypt').compareSync(password,user.password)
        assert(isCheck, 422, '密码错误')
        // if (!isCheck) {
        //     return res.status(422).send({message: '密码错误'})
        // }
        // 根据前端的传参生成token，并返回给前端
        let token = jwt.sign({id: user._id},'secret') // 第一个参数是生成token的依据，第二个参数是任意字符串的密钥
        res.send({token,user})
    }),
    app.use(async (err, req, res, next) => {
        res.status(err.statusCode || 500).send({message: err.message})
    })
}
