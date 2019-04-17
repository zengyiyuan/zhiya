//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    barCur:-1,
    flag: true,
    words: '',
    value: '',
    hotwords: ['英语', '开发','UI','平面设计','视觉设计','华为','小米'],
    swiper:[],
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    orderList:[],
    videoList:[],
    pageSize:3
  },
  changeCur(e){
    this.setData({barCur:e.currentTarget.dataset.id,flag:true,words:this.data.hotwords[e.currentTarget.dataset.id]})
    console.log(this.data.barCur);  
    // this.setData({words:e.detail.words})
  },
  onChange(e) {
    // console.log('onChange', e)
    this.setData({
        value: e.detail.value,
    })
  },
  // 点击搜索框进入搜索页面
  onFocus(e) {
    console.log('onfocus')
    this.setData({flag:false})
  },
  cancel(){
    this.setData({words:'',flag: true})
  },
  // 去搜索
  gosearch(e){
    console.log(this.data.value);
    this.setData({words:this.data.value})
  },
  goReservation(){
    wx.switchTab({
      url: '/pages/reservation/reservation',
    })
  },
  goVideo(){
    wx.switchTab({
      url: '/pages/video/video',
    })
  },
  // 去面约详细页
  goOrderDesc(e){
    var orderId = e.currentTarget.dataset.id;
    console.log(orderId)
    wx.navigateTo({
      url: '/pages/orderDesc/orderDesc?orderId='+orderId,
    })
  },
  // 去视频详细页
  goVideoDesc(e){
    var videoId = e.currentTarget.dataset.videoId;
    var index = e.currentTarget.dataset.index;
    var item = this.data.videoList[index]
    
    wx.navigateTo({
      url: '/pages/videoDesc/videoDesc?item='+JSON.stringify(item),
    })
  },
  // 获取轮播图
  swiper(){
    var that = this;
    wx.request({
      url: 'https://openapi.zhiyajob.com:8443/openapi/querySysBannerList.json?channelType=2&bannerType=4',
      success(res){
        console.log(res.data)
        that.setData({
          swiper:res.data
        })
      }
    })
  },
  // 获取热门面约
  getAbout() {
    var that = this;
    wx.request({
      url: 'https://openapi.zhiyajob.com:8443/openapi/queryInterviewOrderList.json?interviewCustomerId=' + wx.getStorageSync("customerId") + '&beginNum=0&pageSize=' + that.data.pageSize,
      success(res) {
        that.setData({ orderList: res.data.dataList })
      }
    })
  },
  // 获取视频推荐
  getVideoList(){
    var that = this;
    wx.request({
      url: 'https://openapi.zhiyajob.com:8443/openapi/searchDiscoveryVedio.json',
      success(res){
        that.setData({videoList:res.data.dataList});
      }
    })
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function (options) {
    this.getAbout();
    this.getVideoList();
    this.swiper();
    if(options) {
      console.log(options)
      var words = options.keywords;
      // 发送请求根据用户搜索的关键词给出数据
    }
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})
