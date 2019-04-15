// pages/orderPay/orderPay.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderId: '',
    customerId: '',
    openId: '',
    inspectId: null,
    inspectPrice: 0,
    title: '',
    keyWords: ''
  },
  checkChange(e){

  },
  goPay() {
    var that = this;
    if (!this.data.inspectId) {
      wx.request({
        url: 'https://openapi.zhiyajob.com:8443/openapi/addInterviewInspectForWeb.json',
        data: {
          orderId: this.data.orderId,
          payType: 2,
          customerId: wx.getStorageSync("customerId")
        },
        success(res) {
          console.log(res)
          var inspectId = res.data.inspectId;
          that.setData({
            inspectId: inspectId
          });
          that.okPay(that.data.inspectId, that.data.openId)
        }
      })
    } else {
      this.okPay(this.data.inspectId, this.data.openId)
    }
  },
  okPay(inspectId, openId) {
    //1微信支付
    var that = this;
    wx.request({
      url: 'https://openapi.zhiyajob.com:8443/openapi/getMiniProgramParamInspect.json',
      methods: 'get',
      data: {
        openId: openId,
        inspectId: inspectId
      },
      success(msg) {
        console.log(msg)
        if (msg.data.status == "SUCCESS") {
          console.log(msg);
          that.callpay(msg.data.appId, msg.data.timeStamp, msg.data.nonceStr, msg.data.package, msg.data.sign);
        }
      }
    })

  },
  callpay(appId, timeStamp, nonceStr, mypackage, sign) {
    var that = this;
    wx.requestPayment({
      'timeStamp': timeStamp,
      'nonceStr': nonceStr,
      'package': mypackage,
      'signType': 'MD5',
      'paySign': sign,
      'success': function(res) {
        wx.navigateTo({
          url: '/pages/success/success?orderId=' + that.data.orderId,
        })
      },
      'fail': function(res) {
        console.log(res.errMsg)
        wx.navigateTo({
          url: '/pages/fail/fail?err=' + res.errMsg + '&orderId=' + this.data.orderId,
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    var that = this;
    var item = JSON.parse(options.orderId);
    if (item.interviewOrder) {
      this.setData({
        pic: item.interviewOrder.orderImg,
        orderId: item.orderId,
        inspectId: item.inspectId,
        openId: wx.getStorageSync("openId"),
        inspectPrice: item.interviewOrder.inspectPrice,
        title: item.interviewOrder.title,
        keyWords: item.interviewOrder.keyWords
      })
      
    } else {
      this.setData({
        pic: item.orderImg,
        orderId: item.orderId,
        openId: wx.getStorageSync("openId"),
        inspectPrice: item.inspectPrice,
        title: item.title,
        keyWords: item.keyWords
      })
      
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})