const router = require('koa-router')()
const jsonwebtoken = require('jsonwebtoken')
const util = require('util')
const verify = util.promisify(jsonwebtoken.verify)
const app = require('../app')
const { SECRET } = require('../conf/constants') //jwt 密匙


router.prefix('/users')

router.get('/', function (ctx, next) {
  ctx.body = 'this is a users response!'
})

router.get('/bar', function (ctx, next) {
  ctx.body = 'this is a users/bar response'
})


// 模拟登陆

router.post('/login', (ctx, next) => {
  const { userName, password } = ctx.request.body
  console.log(userName, password)
  let userInfo
  if (userName === 'zhangsan' && password === 'abc') {
    userInfo = {
      userName,
      nickName: '张三'
    }
  }
  // 加密
  let token
  if (userInfo) {
    token = jsonwebtoken.sign(userInfo, SECRET, { expiresIn: '1h' })
  }

  if (userInfo == null) {
    ctx.body = {
      error: -1,
      msg: '登陆失败'
    }
    return
  }

  ctx.body = {
    error: 0,
    data: token
  }

})


// 获取用户信息
router.get('/getUserInfo', async (ctx, next) => {
  const token = ctx.header.authorization
  try {
    const payload = await verify(token.split(' ')[1], SECRET)
    ctx.body = {
      error: 0,
      userInfo: payload
    }
  } catch (ex) {
    ctx.body = {
      error: -1,
      msg: '失败'
    }
  }
})
module.exports = router
