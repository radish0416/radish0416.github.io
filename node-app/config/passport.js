/**
 * token 就是用户在登陆成功后后台返回给前台的数据中会附加上一个token，其中包括token值已经token的有效期
 * 在这个用户向后台请求数据的时候会将自己的token附带在请求数据中，后台验证token是否正确以及是否过期
 * 都正确的时候就会返回用户请求的数据，否则不会返回所请求的数据
 * 
 * 
 * 这里是验证token的方法文件，只有token验证通过后才能返回用户请求的数据
 */

 /**
  * 使用passpost验证token必须实现的代码是：
  * const JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
    const opts = {}
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
    opts.secretOrKey = 生成token的时候的默认值;
  *  */
const JwtStrategy = require('passport-jwt').Strategy,
ExtractJwt = require('passport-jwt').ExtractJwt;

const mongoose = require("mongoose");
const User = mongoose.model("users");
const keys = require("../config/keys");

const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrKey;

module.exports = passport => {         //接收server.js中传过来的passport的值
  passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
    // console.log(jwt_payload);
    User.findById(jwt_payload.id)  //查询数据库，根据用户id查询数据
        .then(user => {
          if(user){
            return done(null,user);   //成功返回用户信息
          }
          return done(null,false);
        })
        .catch(err => console.log(err));
  }));
}