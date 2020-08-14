const Validator = require('validator')
const isEmpty = require('./isEmpty')

module.exports = (data) => {
    let errors = {}

    // 保证email、password 类型是string
    data.email = !isEmpty(data.email) ? data.email : ''
    data.password = !isEmpty(data.password) ? data.password : ''
   
    // 邮箱校验
    if(!Validator.isEmail(data.email)) {
        errors.email = '邮箱不合法！'
    }
    if(Validator.isEmpty(data.email)) {
        errors.email = '邮箱不能为空！'
    }
   

    // 密码校验
    if(Validator.isEmpty(data.password)) {
        errors.password = '密码不能为空！'
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
}