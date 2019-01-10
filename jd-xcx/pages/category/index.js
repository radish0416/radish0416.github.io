// pages/category/index.js
// 引入接口配置文件urlconfig
const interfaces = require('../../utils/urlconfig.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    //左边的数据，右边的数据，以及点击左边分类信息的所对应的下标
    navLeftItems: [],
    navRightItems: [],
    curIndex: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const self = this
    wx.showLoading({   //在加载过程中的转圈时候的显示文字
      title: '加载中...',
    })
    wx.request({
      url: interfaces.productions,  //微信自带的请求网址方法
      header: {
        'content-type': 'application/json' // 默认值，返回的数据设置为json数组格式
      },
      success(res) {
        self.setData({
          navLeftItems: res.data.navLeftItems,
          navRightItems: res.data.navRightItems
        })
        wx.hideLoading()
      }
    })
  },
  /*
  * 记录左侧点击的按钮下标 
  */
  switchRightTab(e) {
    //e.currentTarget.dataset.index 是页面上面传过来的值
    let index = parseInt(e.currentTarget.dataset.index);
    this.setData({
      curIndex: index
    })
  },
  /**
   * 点击进入列表页
   * 列表页参数 title
  */
  showListView(e) {
    let txt = e.currentTarget.dataset.txt  //获取商品分类信息的文字
    wx.navigateTo({
      url: '/pages/list/index?title=' + txt  //跳转页面，title是页面的标题
    })
  }
})