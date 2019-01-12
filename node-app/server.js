const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");
const app = express();

// 引入users.js
const users = require("./routes/api/users");
const profile = require("./routes/api/profile");
const posts = require("./routes/api/posts");

// DB config
const db = require("./config/keys").mongoURI;

// 使用body-parser中间件，使用post方法
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());



// Connect to mongodb
mongoose.connect(db)
        .then(() => console.log("MongoDB Connected"))  //成功返回
        .catch(err => console.log(err));     //失败返回


// 使用中间件实现允许跨域
app.use((req,res,next) => {
  res.header("Access-Control-Allow-Origin","*");
  res.header("Access-Control-Allow-Headers","Content-Type");
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
  next();
})

// passport 初始化，必须初始化才能使用token
app.use(passport.initialize());

//引入posspost.js文件，传入passport的值，这样就可以在posspost.js使用已经初始化了的passpost包
require("./config/passport")(passport);    

// app.get("/",(req,res) => {
//   res.send("Hello World!");
// })

// 使用routes
app.use("/api/users",users);
app.use("/api/profile",profile);
app.use("/api/posts",posts);

const port = process.env.PORT || 5000;

app.listen(port,() => {
  console.log(`Server running on port ${port}`);
})