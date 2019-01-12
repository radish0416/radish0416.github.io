const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

const Profile = require("../../models/Profiles");
const User = require("../../models/User");

const validateProfileInput = require("../../validation/profile");
const validateExperienceInput = require("../../validation/experience");
const validateEducationInput = require("../../validation/education");


// $route  GET api/profile/test
// @desc   返回的请求的json数据
// @access public
router.get("/test",(req,res) => {
  res.json({msg:"profile works"})
})

// $route  GET api/profile
// @desc   获取当前登录用户的个人信息
// @access private
router.get("/",passport.authenticate('jwt', { session: false }),(req,res) => {
  const errors = {};
  Profile.findOne({user: req.user.id})
          .populate('user',["name","avatart"])
          .then((profile) => {
    if(!profile){
      errors.noprofile = "该用户的信息不存在~!";
      return res.status(404).json(errors);
    }

    res.json(profile);
  }).catch(err => res.status(404).json(err));
})


// $route  POST api/profile
// @desc   创建和编辑个人信息接口
// @access private
router.post("/",passport.authenticate('jwt', { session: false }),(req,res) => {
  const {errors,isValid} = validateProfileInput(req.body);

  // 判断isValid是否通过
  if(!isValid){
    return res.status(400).json(errors);
  }

  const profileFields = {};
  profileFields.user = req.user.id;
  if(req.body.handle) profileFields.handle = req.body.handle;
  if(req.body.company) profileFields.company = req.body.company;
  if(req.body.website) profileFields.website = req.body.website;
  if(req.body.location) profileFields.location = req.body.location;
  if(req.body.status) profileFields.status = req.body.status;


  if(req.body.bio) profileFields.bio = req.body.bio;
  if(req.body.githubusername) profileFields.githubusername = req.body.githubusername;

  // skills - 数组转换，如果输入技能信息，就根据逗号把各个技能隔开存放在数组中
  if(typeof req.body.skills !== "undefined"){
    profileFields.skills = req.body.skills.split(",");
  }

  profileFields.social = {};

  if(req.body.wechat) profileFields.social.wechat = req.body.wechat;
  if(req.body.QQ) profileFields.social.QQ = req.body.QQ;
  if(req.body.tengxunkt) profileFields.social.tengxunkt = req.body.tengxunkt;
  if(req.body.wangyikt) profileFields.social.wangyikt = req.body.wangyikt;

  Profile.findOne({user: req.user.id}).then(profile => {
    if(profile){
      // 用户信息存在, 执行更新方法
      Profile.findOneAndUpdate({user:req.user.id},{$set:profileFields},{new:true}).then(profile => res.json(profile));
    }else{
      // 用户信息不存在, 执行创建方法，判断handle也就是用户名是否存在。别人是否使用，使用了就提示重新输入，否则存储
      Profile.findOne({handle:profileFields.handle}).then(profile => {
        if(profile){
          errors.handle = "该用户的handle个人信息已经存在,请勿重新创建!";
          res.status(400).json(errors);
        }

        new Profile(profileFields).save().then(profile => res.json(profile));
      })
    }
  })

})

// $route  GET api/profile/handle/:handle
// @desc   通过handle获取个人信息
// @access public
router.get("/handle/:handle",(req,res) => {
  const errors = {};
  Profile.findOne({handle:req.params.handle})
  //在查询出profile信息后可以使用该方法给profile信息加上额外的信息，user是表，"name","avatart"是user表中的数据
         .populate('user',["name","avatart"])  
         .then(profile => {
           if(!profile){
             errors.noprofile = "未找到该用户信息";
             res.status(404).json(errors);
           }

           res.json(profile);
         })
         .catch(err => res.status(404).json(err));
})

// $route  GET api/profile/user/:user_id
// @desc   通过user_id获取个人信息
// @access public
router.get("/user/:user_id",(req,res) => {
  const errors = {};
  Profile.findOne({user:req.params.user_id})
         .populate('user',["name","avatart"])
         .then(profile => {
           if(!profile){
             errors.noprofile = "未找到该用户信息";
             res.status(404).json(errors);
           }

           res.json(profile);
         })
         .catch(err => res.status(404).json(err));
})

// $route  GET api/profile/all
// @desc   获取所有人的信息
// @access public
router.get("/all",(req,res) => {
  const errors = {};
  Profile.find()  //查找数据库中profile表的所有信息
         .populate('user',["name","avatart"])
         .then(profiles => {
           if(!profiles){
             errors.noprofile = "没有任何用户信息";
             res.status(404).json(errors);
           }

           res.json(profiles);
         })
         .catch(err => res.status(404).json(err));
})


// $route  POST api/profile/experience
// @desc   添加个人经历
// @access Private
router.post("/experience",passport.authenticate('jwt', { session: false }),(req,res) => {
  const {errors,isValid} = validateExperienceInput(req.body);

  // 判断isValid是否通过
  if(!isValid){
    return res.status(400).json(errors);
  }

  Profile.findOne({user:req.user.id})
         .then(profile => {
           const newExp = {
             title:req.body.title,
             company:req.body.company,
             location:req.body.location,
             from:req.body.from,
             to:req.body.to,
             current:req.body.current,
             description:req.body.description,
           }

           profile.experience.unshift(newExp);

           profile.save().then(profile => res.json(profile));
         })
})


// $route  POST api/profile/education
// @desc   添加个人学历
// @access Private
router.post("/education",passport.authenticate('jwt', { session: false }),(req,res) => {
  const {errors,isValid} = validateEducationInput(req.body);

  // 判断isValid是否通过
  if(!isValid){
    return res.status(400).json(errors);
  }

  Profile.findOne({user:req.user.id})
         .then(profile => {
           const newEdu = {
             school:req.body.school,
             degree:req.body.degree,
             fieldofstudy:req.body.fieldofstudy,
             from:req.body.from,
             to:req.body.to,
             current:req.body.current,
             description:req.body.description,
           }

           profile.education.unshift(newEdu);

           profile.save().then(profile => res.json(profile));
         })
})


// $route  DELETE api/profile/experience/:epx_id
// @desc   删除个人经历
// @access Private
router.delete("/experience/:epx_id",passport.authenticate('jwt', { session: false }),(req,res) => {
  
  Profile.findOne({user:req.user.id})
         .then(profile => {
           const removeIndex = profile.experience   //用map遍历用户个人经历的，找到删除经历的id号的下标号
              .map(item => item.id)
              .indexOf(req.params.epx_id);

          profile.experience.splice(removeIndex,1); //根据下标号从数组中删除数据，删除一条数据

          profile.save().then(profile => res.json(profile));  //删除后再进行一次保存，将新的个人经历保存到数据库中
         })
         .catch(err => res.status(404).json(err));
})

// $route  DELETE api/profile/education/:edu_id
// @desc   删除个人学历
// @access Private
router.delete("/education/:edu_id",passport.authenticate('jwt', { session: false }),(req,res) => {
  
  Profile.findOne({user:req.user.id})
         .then(profile => {
           const removeIndex = profile.experience
              .map(item => item.id)
              .indexOf(req.params.epx_id);

          profile.education.splice(removeIndex,1);

          profile.save().then(profile => res.json(profile));
         })
         .catch(err => res.status(404).json(err));
})

// $route  DELETE api/profile
// @desc   删除整个用户
// @access Private
router.delete("/education/:edu_id",passport.authenticate('jwt', { session: false }),(req,res) => {
  
  Profile.findOneAndRemove({user:req.user.id})
         .then(() => {
           User.findOneAndRemove({_id:req.user.id})
               .then(() => {
                 res.json({success:true})
               })
         })
})

module.exports = router;