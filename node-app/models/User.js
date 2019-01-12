//models是模型类，也就是创建数据库中的各种表，然后将表反射出去,这样就可以使用mongoose的方法
//当表中的字段设置成必输项的时候就加一个required:true，否则不加
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// 创建用户表
const UserSchema = new Schema({
  name:{   //用户名称
    type:String,
    required:true
  },
  email:{  //用户邮箱，唯一值
    type:String,
    required:true
  },
  password:{ //用户密码
    type:String,
    required:true
  },
  avatar:{   //用户头像
    type:String
  },
  date:{  //用户创建时间
    type:Date,
    default:Date.now
  }
})

//将user表作为mongoose一个模块命名为User反射出去
module.exports = User = mongoose.model("users",UserSchema);