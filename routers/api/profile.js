const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const passport = require('passport')

const User = require('../../models/User')  // 引入模型
const Profile = require('../../models/Profile')  // 引入模型


// $route  GET /api/profile/test
// @desc   返回请求的json数据
// @access Public
router.get('/test',(req, res) => {
    res.json({msg: 'profile works'})
})


// $route  GET /api/profile
// @desc   返回当前登录用户的个人信息
// @access Private
router.get('/', passport.authenticate('jwt', {session: false}), (req, res) => {
    const errors = {}
    Profile.findOne({user: req.user.id})
        .then(profile => {
            console.log(profile);
            if(!profile) {
                errors.noprofile = '该用户的信息不存在~！'
                return res.status(404).json(errors)
            }
            return res.json(profile)
        })
        .catch(err => res.status(404).json(err))
})

// $route  POST /api/profile
// @desc   创建和编辑个人信息接口
// @access Private
router.post('/', passport.authenticate('jwt', {session: false}), (req, res) => {
    
    
})

module.exports = router