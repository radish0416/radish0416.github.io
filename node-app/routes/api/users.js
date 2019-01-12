//api文件夹是接口文件夹，通过路由实现前后台的数据连接，
//前台界面使用的数据都是通过这里的文件进行获取，前台的数据传到后台也是通过这些文件

/**
 * 传出去是router.get("/test",(req,res) => {
          res.json({msg:"login works"})
          })
          这里就是请求:网址/test网址的的时候返回res.json({msg:"login works"})数据

      router.post("/register",(req,res) => {
        
      }这样就是获取界面register返回的数据
      req.body是返回的数据
 * */



// @login & register 
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const gravatar = require('gravatar');
const keys = require("../../config/keys");
const passport = require("passport");

const User = require("../../models/User");

// 引入验证方法
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");

// $route  GET api/users/test
// @desc   返回的请求的json数据
// @access public
router.get("/test",(req,res) => {
  res.json({msg:"login works"})
})

// $route  POST api/users/register
// @desc   返回的请求的json数据
// @access public
router.post("/register",(req,res) => {

  const {errors,isValid} = validateRegisterInput(req.body);

  // 判断isValid是否通过
  if(!isValid){
    return res.status(400).json(errors);
  }

  // 查询数据库中是否拥有邮箱
  User.findOne({email:req.body.email})  //查询一条数据，也就是查询邮箱，判断是否有返回值
      .then((user) => {
        if(user){
          return res.status(400).json({email:"邮箱已被注册!"})
        }else{
          //调用第三方插件进行设置默认头像，如果注册用户的账号在gravatar上面注册过就会返回该用户的gravatar上面的头像
          const avatar = gravatar.url(req.body.email, {s: '200', r: 'pg', d: 'mm'});

          const newUser = new User({
            name:req.body.name,
            email:req.body.email,
            avatar,
            password:req.body.password
          })
          /**
           * 这里是调用第三方插件进行密码的加密，安装bcrypt模块后，调用这个方法进行加密，
           * 数字10是随便写的
           * 加密的值是newUser.password，返回的加密码是一个哈希码 hash
           * 然后保存到数据库中
           * 
           */

          bcrypt.genSalt(10, function(err, salt) {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
                if(err) throw err;

                newUser.password = hash;

                newUser.save()
                       .then(user => res.json(user))
                       .catch(err => console.log(err));
            });
          });


        }
      })
})

// $route  POST api/users/login
// @desc   返回token jwt passport
// @access public

router.post("/login",(req,res) => {
  //判断输入信息是否合法
  const {errors,isValid} = validateLoginInput(req.body);  

  // 判断isValid是否通过
  if(!isValid){
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;
  // 查询数据库
  User.findOne({email}) //es6可以写成这样子，也可以写成 User.findOne({email:req.body.email})，因为查询的值和返回的值是一样的
      .then(user => {
        if(!user){
          return res.status(404).json({email:"用户不存在!"});
        }

        // 密码匹配，因为密码进行加密了，所以要使用bcrypt包的方法进行解密匹配
        bcrypt.compare(password, user.password)
              .then(isMatch => {
                if(isMatch){
                  const rule = {id:user.id,name:user.name};  //这个是返回的token的值，设置成返回用户的id和名称
                  //生产token，keys.secretOrKey是一个自己定义的默认值，expiresIn是token的有效期
                  jwt.sign(rule,keys.secretOrKey,{expiresIn:3600},(err,token) => {
                    if(err) throw err;
                    res.json({
                      success:true,
                      token:"Bearer " + token  //token的Bearer是固定的，必须是这个，不然token就会验证不了
                    });
                  })
                  // res.json({msg:"success"});
                }else{
                  return res.status(400).json({password:"密码错误!"});
                }
              })
      })
})

// $route  GET api/users/current
// @desc   return current user
// @access Private
//验证tokenpassport.authenticate('jwt', { session: false }），jwt就是token的值
router.get("/current",passport.authenticate('jwt', { session: false }),(req,res) => {
  res.json({
    id:req.user.id,
    name:req.user.name,
    email:req.user.email
  });
})

module.exports = router;