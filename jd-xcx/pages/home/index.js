// pages/home/index.js

// 引入接口配置文件urlconfig
const interfaces = require('../../utils/urlconfig.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    swipers: [],  //轮播图的图片信息
    logos: [],   //分类图标
    quicks: [],  //秒杀信息
    pageRow: [], //会场分类信息
    indicatorDots: true,  
    vertical: false,
    autoplay: true,
    interval: 3000,  //轮播图的图片滚动的时间间隔
    duration: 500    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const self = this
    wx.showLoading({
      title: '加载中...',
    })
    wx.request({
      url: interfaces.homepage,
      header: {
        'content-type': 'application/json' // 默认值，返回的数据设置为json数组格式
      },
      success(res) {  //请求成功后进行设值
        self.setData({
          swipers: res.data.swipers,
          logos: res.data.logos,
          quicks: res.data.quicks,
          pageRow: res.data.pageRow
        })
        wx.hideLoading()  //隐藏加载图标
      }
    })
  },
})