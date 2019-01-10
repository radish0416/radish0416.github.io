// pages/list/index.js
// 引入接口配置文件urlconfig
const interfaces = require('../../utils/urlconfig.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    prolist: [],
    page: 1, // 当前请求的page
    size: 5, // 请求数据的size
    noData: false // 是否有更多数据
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: options.title
    })

    // 发送接口请求
    const self = this
    wx.showLoading({
      title: '加载中...',
    })
    wx.request({
      url: interfaces.productionsList,
      success(res) {
        self.setData({
          prolist: res.data
        })
        wx.hideLoading()
      }
    })

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    // 请求数据
    wx.showNavigationBarLoading() //在标题栏中显示加载
    this.setData({
      page: 1,
      noData: false
    })
    const self = this
    wx.request({
      url: interfaces.productionsList,
      success(res) {
        self.setData({
          prolist: res.data
        })
        // 隐藏加载状态
        wx.hideNavigationBarLoading()
        wx.stopPullDownRefresh();
      }
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    // 判读数据是否加载完毕
    if (this.data.noData) return
    
    // 停止下拉刷新
    wx.stopPullDownRefresh();
    wx.showNavigationBarLoading() //在标题栏中显示加载

    const prolist = this.data.prolist
    let page = this.data.page
    this.setData({ // 每次下拉 page+1
      page: ++page
    })
    const self = this
    wx.request({
      url: interfaces.productionsList + '/' + self.data.page + '/' + self.data.size,  //请求商品分类的商品列表信息
      success(res) {
        if (res.data.length == 0) {  
          //如果商品列表信息没有的话就分类页面的右边部分不显示
          self.setData({
            noData: true
          })
        } else {
          res.data.forEach(item => {  //获取成功后直接进行赋值
            prolist.push(item)
          })
          self.setData({
            prolist: prolist
          })
        }
        // 隐藏加载状态
        wx.hideNavigationBarLoading()
      }
    })
  },
  /**
   * 点击查看详情
  */
  switchProlistDetail: function (e) {
    //获取当前选中商品的所在商品列表中的下标
    var index = e.currentTarget.dataset.index  
    wx.navigateTo({
      //点击图片后直接进行跳转到商品详细信息的页面，进行id匹配
      url: '/pages/detail/index?id=' + this.data.prolist[index].id,
    })
  }
})