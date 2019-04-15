// pages/myfavor/myfavor.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderNumerHeight: 10,
    orderLen: 0,
    classifyName: ['约面', '视频'],
    classifyCur: 0,
    navlist: ['约面', '视频'],
    orderList: [],
    list: [],
    tabCur: 0,
    status: ["待支付", "待观摩", "已完成"],
    pageSize:5,
  },
  tabSelect: function (e) {
    if (e.currentTarget) {
      this.setData({ tabCur: e.currentTarget.dataset.id })
      // this.getOrdersClassify();
      // this.getqdorder(e.currentTarget.dataset.id);
    } else {
      this.setData({ tabCur: 0 })
    }

  },
  getAbout() {
    var that = this;
    wx.request({
      url: 'https://openapi.zhiyajob.com:8443/openapi/queryInterviewOrderList.json?interviewCustomerId=' + wx.getStorageSync("customerId") + '&beginNum=0&pageSize=' + that.data.pageSize,
      success(res) {
        that.setData({ orderList: res.data.dataList })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getAbout();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})