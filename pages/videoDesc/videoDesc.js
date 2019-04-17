const { api, host } = require("../../config.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    src: '',
    pic: '',
    isFocus:false,
    tab: ['详情', '评论'],
    TabCur: 0,
    scrollLeft: 0,
    orderId: 0,
    orderList: [],
    isbuy: false,
    isPlay:false,
    orderDesc: {},
    pageVideoSize: 3,
    pageCommentSize: 3,
    isFavor: false,
    isZan: false,
    defaultValue: '',
    commentList: [],
    videoList:[],
  },
  tabSelect(e) {
    console.log(e);
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60
    })
  },
  changeFocus(){
    this.setData({isFocus:true})
  },
  // 获取视频地址
  getsrc() {
    // console.log(111)
    this.setData({ src: '../../video/video/59b6bb1098e51.mp4' })
  },
  toPlay() {
    this.setData({ isPlay: true })
  },
  // 去订单支付页
  toOrderPay() {
    console.log(this.data.orderId)
    var orderId = this.data.orderId;
    wx.navigateTo({
      url: '/pages/orderPay/orderPay?orderId=' + orderId + '',
    })
  },
  setValue(e){
    this.setData({defaultValue:e.detail.value})
  },
  // 评论
  toComment() {
    var that = this;
    console.log(this.data.defaultValue);
    wx.request({
      url: api + 'addWxDiscoveryEvaluate.json',
      method: 'post',
      data: { "parentId": 0, "vedioId": that.data.orderId, "evaluateContent": that.data.defaultValue },
      header: { 'content-type': 'application/x-www-form-urlencoded' ,"cookie": "customerId=" + wx.getStorageSync("customerId") },
      success(res) {
        console.log(res)
        var newArr = that.data.commentList;
        newArr.unshift(res.data.evaluate)
        that.setData({ defaultValue: '', commentList: newArr });
        wx.showToast({
          title: '评论成功',

        })
      }
    })


  },
  // 获取相关面约
  getAbout() {
    var that = this;
    wx.request({
      url: 'https://openapi.zhiyajob.com:8443/openapi/queryInterviewOrderList.json?interviewCustomerId=' + wx.getStorageSync("customerId") + '&beginNum=0&pageSize=' + that.data.pageVideoSize,
      success(res) {
        that.setData({ orderList: res.data.dataList })
      }
    })
  },
  // 设置收藏
  setFavor() {
    var that = this;
    if (this.data.isFavor) {
      // 取消收藏
      wx.request({
        url: api + 'cancelCustomerCollect.json',
        method: 'post',
        data: { dataId: this.data.orderId, type: "2" },
        header: { "content-type": "application/x-www-form-urlencoded","cookie": 'customerId=' + wx.getStorageSync('customerId') },
        success(res) {
          console.log(res);
          if (res.errMsg == "request:ok") {
            that.setData({ isFavor: false })
          }
        }
      })
    } else {
      // 添加收藏
      wx.request({
        url: api + 'addCustomerCollect.json',
        method: 'post',
        data: { dataId: this.data.orderId, type: "2" },
        header: { "content-type": "application/x-www-form-urlencoded","cookie": 'customerId=' + wx.getStorageSync('customerId') },
        success(res) {
          console.log(res);
          if (res.errMsg == "request:ok") {
            that.setData({ isFavor: true })
          }
        }
      })
    }

  },
  // 点赞
  setZan() {
    var that = this;
    if (this.data.isZan) {
      wx.request({
        url: api + 'cancelCustomerPraise.json',
        method: 'post',
        data: { dataId: this.data.orderId, type: "2" },
        header: { "content-type": "application/x-www-form-urlencoded", "cookie": 'customerId=' + wx.getStorageSync('customerId') },
        success(res) {
          console.log(res);
          if (res.errMsg == "request:ok") {
            that.setData({ isZan: false })
          }
        }
      })
    } else {
      wx.request({
        url: api + 'addCustomerPraise.json',
        method: 'post',
        data: { dataId: this.data.orderId, type: "2" },
        header: { "content-type": "application/x-www-form-urlencoded","cookie": 'customerId=' + wx.getStorageSync('customerId') },
        success(res) {
          console.log(res);
          if (res.errMsg == "request:ok") {
            that.setData({ isZan: true })
          }
        }
      })
    }

  },
  // 获取评论
  getComment() {
    var that = this;
    wx.request({
      url: host + "queryDiscoveryVedioEvaluateList.json?vedioId="+that.data.orderId+"&beginNum=0&pageSize="+that.data.pageCommentSize,
      success(res) {
        console.log(res)
        that.setData({ commentList: res.data.dataList })
      }
    })
  },
  // 获取推荐视频
  getVideoList() {
    var that = this;
    wx.request({
      url: 'https://openapi.zhiyajob.com:8443/openapi/searchDiscoveryVedio.json',
      success(res) {
        that.setData({ videoList: res.data.dataList });
      }
    })
  },
  goVideoDesc(e) {
    var videoId = e.currentTarget.dataset.videoid;
    var index = e.currentTarget.dataset.index;
    var item = this.data.videoList[index]

    wx.navigateTo({
      url: '/pages/videoDesc/videoDesc?item=' + JSON.stringify(item),
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var item = JSON.parse(options.item);
    console.log(item)
    this.setData({orderId: item.vedioId,orderDesc:item });
    this.getVideoList();
    // wx.request({
    //   url: 'https://openapi.zhiyajob.com:8443/openapi/getInterviewOrder.json?interviewOrderId=' + orderId + '',
    //   success(res) {
    //     that.setData({ orderDesc: res.data })
    //     console.log(that.data.orderDesc)
    //   }
    // })
    wx.request({
      url: api + 'getCustomerCollectAndPraise.json?dataId=' + that.data.orderId + '&type=2',
      success(res) {
        console.log(res)
        if (res.data.praiseFlag == 1) {
          that.setData({ isFavor: true });
        }
        if (res.data.collectFlag == 1) {
          that.setData({ isZan: true })
        }
      }
    })
    this.getAbout();
    this.getComment();

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.getsrc();
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
    console.log('到页面底部了')

    if (this.data.TabCur == 0) {
      this.data.pageVideoSize++;

      this.getAbout();
    }
    if (this.data.TabCur == 1) {
      this.data.pageCommentSize++;
      this.getComment();
    }


  },

  /**
   * 用户点击右上角分享
   */
  // onShareAppMessage() {
  //   // share();
  //   var that = this;
  //   var shareObj = {
  //     title: "约面详情",
  //     path: "/pages/videoDesc/videoDesc?shareCustomerId=" + wx.getStorageSync("customerId") + "&orderId=" + that.data.orderId,
  //     success: function (res) {
  //       // 转发成功之后的回调
  //       if (res.errMsg == 'shareAppMessage:ok') {

  //       }
  //     },
  //     fail: function () {

  //       if (res.errMsg == 'shareAppMessage:fail cancel') {
  //         // 用户取消转发
  //       } else if (res.errMsg == 'shareAppMessage:fail') {
  //       }
  //     }
  //   }

  //   return shareObj
  // },
})