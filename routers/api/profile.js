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
            // console.log(profile);
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
    // console.log(req.user);    
    const errors = {}  
    const profileFields = {}
    const { handle, company, website, location, status, bio, githubusername, skills, social } = req.body

    profileFields.user = req.user.id
    
    if(handle) profileFields.handle = handle
    if(company) profileFields.company = company
    if(website) profileFields.website = website
    if(location) profileFields.location = location
    if(status) profileFields.status = status
    if(bio) profileFields.bio = bio
    if(githubusername) profileFields.githubusername = githubusername

    // skills [String]
    if(typeof skills !== undefined) {
        profileFields.skills = skills.split(',')
    }

    // social {{}}
    profileFields.social = {}
    if(social) {
        const { wechat, QQ, tengxunkt, wangyikt } = social
        if(social.wechat) profileFields.social.wechat = wechat
        if(social.QQ) profileFields.social.QQ = QQ
        if(social.tengxunkt) profileFields.social.tengxunkt = tengxunkt
        if(social.wangyikt) profileFields.social.wangyikt = wangyikt
    }

    Profile.findOne({ user: req.user.id })
           .then(profile => {
                if(profile) {
                    // 用户信息存在，执行更新方法
                    Profile.findOneAndUpdate(
                        { user: req.user.id },
                        { $set: profileFields },
                        { new: true }
                    )
                    .then(profile => res.json(profile))
                } else {
                    // 用户信息不存在，执行创建方法
                    Profile.findOne({handle: profileFields.handle})
                            .then(profile => {
                                if(profile) {
                                    errors.handle = '该用户的handle个人信息已经存在，请勿重新创建！'
                                    res.status(400).json(errors)
                                }
                                // 用户信息不存在 创建新用户
                                new Profile(profileFields).save().then(profile => res.json(profile))
                            })
                   
                }
           })
})

module.exports = router