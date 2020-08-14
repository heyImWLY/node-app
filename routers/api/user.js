// @login & register
const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')     // 加密解密
const gravatar = require('gravatar') // 头像
const jwt = require('jsonwebtoken')  // json
const passport = require('passport')

const User = require('../../models/User')
const { secretOrKey } = require('../../config/key')

// 引入验证方法
const validateRegisterInput = require('../../validation/register')
const validateLoginInput = require('../../validation/login')

// $route  GET /api/users/test
// @desc   返回请求的json数据
// @access Public
router.get('/test',(req, res) => {
    res.json({msg: 'login works'})
})

// $route  POST /api/users/register
// @desc   返回请求的json数据
// @access Public
router.post('/register',(req, res) => {
    const { errors, isValid } = validateRegisterInput(req.body)  // 调用验证方法 用于校验用户名是否符合规范
    // 判断验证是否通过
    if(!isValid) {
        return res.status(400).json(errors)
    }
    // 查询数据库中是否拥有邮箱
    User.findOne({email: req.body.email})
    .then(user => {
        if(user) {
            return res.status(400).json({email: "邮箱已被注册！"})
        } else {
            let avatar = gravatar.url(req.body.email, {s: '200', r: 'pg', d: 'mm'})
            const newUser = new User({
                name: req.body.name,
                email: req.body.email,
                avatar,
                password: req.body.password
            })

            bcrypt.genSalt(10, (err, salt) => {
                // 加密密码
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if(err) throw err
                    newUser.password = hash  // 赋值密码
                    
                    newUser.save()           // 存储
                        .then(user => res.json(user))  // 返回密码
                        .catch(err => console.log(err))// 打印报错
                });
            });
         }
    })
})

// $route  POST /api/users/login
// @desc   返回token jwt password
// @access Public
router.post('/login', (req, res) => {
    const { errors, isValid } = validateLoginInput(req.body)
    
    // 判断isValid是否通过
    if(!isValid) {
        return res.status(400).json(errors)
    }
    const { email, password } = req.body
    User.findOne({email})
        .then(user => {
            if(!user) {
                return res.status(404).json({email: '用户不存在！'})
            }

            // 密码匹配
            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if(isMatch) {
                        // jwt.sign("规则","加密名字","过期时间","箭头函数")
                        const rule = { id: user.id, name: user.name }    // 规则
                        jwt.sign(rule,secretOrKey,{ expiresIn: 3600 },(err, token) => {
                            if(err) throw err
                            res.json({success: true, token: 'Bearer ' + token})
                        })
                        
                        // res.json({msg: 'success'})
                    } else {
                        return res.status(400).json({password: '密码错误！'})
                    }
                })
        })
})

// $route  GET /api/users/current
// @desc   返回 current user info
// @access Private 私有接口 需要验证token才能拿到数据
router.get('/current', passport.authenticate('jwt', {session: false}), (req, res) => {  // passport.authenticate 验证token
    console.log(req.user);
    let { id, name, email } = req.user
    res.json({id, name, email})
})


module.exports = router