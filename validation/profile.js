const Validator = require('validator')
const isEmpty = require('./isEmpty')

module.exports = (data) => {
    let errors = {}

    // 保证handle、status、skills 类型是string
    data.handle = !isEmpty(data.handle) ? data.handle : ''
    data.status = !isEmpty(data.status) ? data.status : ''
    data.skills = !isEmpty(data.skills) ? data.skills : ''
   
    // 用户名校验
    if(!Validator.isLength(data.handle, { min: 2, max: 40 })) {
        errors.name = "用户名的长度不能小于2位并且不能大于40位！"
    }
    if(Validator.isEmpty(data.handle)) {
        errors.handle = 'handle不能为空！'
    }
    if(Validator.isEmpty(data.status)) {
        errors.status = 'status不能为空！'
    }
    if(Validator.isEmpty(data.skills)) {
        errors.skills = 'skills不能为空！'
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
}