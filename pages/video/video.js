const {host,api}=require("../../config.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    select: ["简历", "面试", "实习","政策", "招聘会", "行业"],
    selectCur: 0,
    sorts: ["热播版", "新上线"],
    sortsCur:-1,
    show: false,
    shownavindex: 0,
    barCur: -1,
    flag: true,
    words: '',
    value: '',
    hotwords: ['英语', '开发', 'UI', '平面设计', '视觉设计', '华为', '小米'],
    swiper: ['../../image/swiper1'],
    userInfo: {},
    hasUserInfo: false,
    orderList: [],
    pageSize: 3,
    content: [],
    city: [],
    videoList: [],
    shownavindex: '',
    cateId:null,
    sortType:null,
  },
  changeShow() {
    this.setData({ show: false })
  },
 
  // 点击灰色背景隐藏所有的筛选内容
  hidebg: function (e) {
    this.setData({
     
      shownavindex: 0,
    })
  },
  selectEmpty() {
    this.setData({ selectCur: 0 })
  },
  selectconfirm() {
    var that = this;
    console.log(this.data.select[this.data.selectCur])
    this.setData({ show: false })
    wx.request({
      url: host + 'searchDiscoveryVedio.json?beginNum=0&pageSize=8&sortType='+ '&keyWords=' + that.data.words + '&cateId=' + that.data.cateId,
      success(res) {
        that.setData({ videoList: res.data.dataList })
      }
    })
  },
  changeCur(e) {
    this.setData({ barCur: e.currentTarget.dataset.id })
    console.log(this.data.barCur);
    this.setData({ flag: true })
    this.setData({ words: this.data.hotwords[this.data.barCur] })
  },
  selectCur(e) {
    this.setData({ selectCur: e.currentTarget.dataset.id,cateId:e.currentTarget.dataset.id+1 })
    console.log(this.data.selectCur);

  },
  getsort(e){
    var that =this;
    this.setData({sortsCur:e.currentTarget.dataset.sort});
    console.log(this.data.sortsCur);
    wx.request({
      url: host + 'searchDiscoveryVedio.json?beginNum=0&pageSize=8&sortType=' + that.data.sortsCur + '&keyWords=' + that.data.words + '&cateId=',
      success(res) {
        that.setData({ videoList: res.data.dataList })
      }
    })
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
    this.setData({ flag: false })
  },
  cancel() {
    this.setData({ words: '', flag: true })
  },
  gosearch(e) {
    console.log(this.data.value);
    this.setData({ words: this.data.value })
  },
  goVideoDesc(e) {
    var videoId = e.currentTarget.dataset.videoid;
    var index = e.currentTarget.dataset.index;
    var item = this.data.videoList[index]

    wx.navigateTo({
      url: '/pages/videoDesc/videoDesc?item=' + JSON.stringify(item),
    })
  },
  swiper() {
    var that = this;
    wx.request({
      url: 'https://openapi.zhiyajob.com:8443/openapi/querySysBannerList.json?channelType=2&bannerType=4',
      success(res) {
        console.log(res.data)
        that.setData({
          swiper: res.data
        })
      }
    })
  },
  getVideoList() {
    var that = this;
    wx.request({
      url: 'https://openapi.zhiyajob.com:8443/openapi/searchDiscoveryVedio.json',
      success(res) {
        that.setData({ videoList: res.data.dataList });
      }
    })
  },
  bindtap(e) {
    console.log(e.detail)
  },
  showCity() {
    this.setData({ tabCur: 0, show: !this.data.show, shownavindex: 1 })
  },
  select() {
    this.setData({ tabCur: 2, show: !this.data.show, shownavindex: 3 })

  },
  getSelect(){
    var that = this;
    wx.request({
      url: host+'queryDiscoveryClassifyList.json',
      success(res){
        console.log(res)
        that.setData({select:res.data});
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getVideoList();
    this.getSelect();
    if (options) {
      console.log(options)
      var words = options.keywords;
      // 发送请求根据用户搜索的关键词给出数据
    }
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
    console.log('到页面底部了')
    this.data.pageSize++;
    this.getVideoList();

  },
  
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

})