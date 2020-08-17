const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Create Schema
const ProfileSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId, // 对象ID类型 根据id关联数据库 查找对应user下的profile
        ref: 'user', // ref值需要对应mongoose.model中的第一个参数，即数据库中的集合名称，否则查询失败
    },
    handler: {
        type: String,
        required: true,
        max: 40
    },
    company: String,  
    website: String, 
    location: String, 
    status: {
        type: String,
        required: true
    }, 
    skill: {
        type: [String],
        required: true,
    },
    bio: String, 
    githubusername: String, 
    experience: [
        {
            current: {
                type: Boolean,
                default: true
            },
            title: {
                type: String,
                required: true,
            },
            company: {
                type: String,
                required: true,
            },
            location: String,  
            from: {
                type: String,
                required: true,
            },
            to: String,  
            description: String,  
        }
    ],
    education: [
        {
            current: {
                type: Boolean,
                default: true
            },
            school: {
                type: String,
                required: true,
            },
            degree: {
                type: String,
                required: true,
            },
            fieldofstudy: {
                type: String,
                required: true,
            },
            from: {
                type: String,
                required: true,
            },
            to:  String,  
            description:  String,  
        }
    ],
    social: {
        wechat: {
            type: String
        },
        QQ: {
            type: String
        },
        tengxunkt: {
            type: String
        },
        wangyikt: {
            type: String
        },
    },
    date: {
        type: Date, 
        default: Date.now
    },

})
 
module.exports = Profile = mongoose.model('profile', ProfileSchema)