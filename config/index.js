const bcrypt = require('bcrypt')

module.exports = {
    secretKey: 'xiaowu-2232304932@qq.com',
    expiresIn: 3600 * 2,
    BASE_URL: 'mongodb://127.0.0.1:27017/test',
    salt: bcrypt.genSalt(10)
}
