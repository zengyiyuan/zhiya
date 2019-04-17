let City = require('../../utils/allcity.js');
var cityData = require('../../utils/city.js');
let {host,api} = require('../../config.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    select:["不限","免费","付费"],
    selectCur:0,
    show:false,
    shownavindex:0,
    barCur: -1,
    flag: true,
    value: '',
    hotwords: ['英语', '开发', 'UI', '平面设计', '视觉设计', '华为', '小米'],
    swiper: [],
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    orderList: [],
    pageSize: 3,
    content: [],
    sorts:[],
    sortsCur:-1,
    city: [],
    config: {
      horizontal: true, // 第一个选项是否横排显示（一般第一个数据选项为 热门城市，常用城市之类 ，开启看需求）
      animation: true, // 过渡动画是否开启
      search: true, // 是否开启搜索
      searchHeight: 45, // 搜索条高度
      suctionTop: true // 是否开启标题吸顶
    },
   
    cityleft: cityData.getCity(), //获取区域的下拉框筛选项内容
    citycenter: {}, //选择区域左边筛选框后的显示的中间内容部分
    cityright: {}, //选择区域的中间内容部分后显示的右边内容
    select1: '', //区域选中后的第二个子菜单，默认显示地铁下的子菜单
    select2: '', //区域选择部分的中间
    select3: '', //区域选择部分的右边
    shownavindex: '',
    words:'',
    isCharge:'',
    cityId:'',
    industryId:'',
    positionId:''
  },
  changeShow(){
    this.setData({show:false})
  },
  selectleft: function (e) {
    console.log('用户选中左边菜单栏的索引值是：' + e.target.dataset.city);
    this.setData({
      cityright: {},
      citycenter: this.data.cityleft[e.currentTarget.dataset.city],
      select1: e.target.dataset.city,
      select2: ''
    });
  },
  // 区域中间栏选择的内容
  selectcenter: function (e) {
    this.setData({
      cityright: this.data.citycenter[e.currentTarget.dataset.city],
      select2: e.target.dataset.city
    });
  },
  // 区域左边栏选择的内容
  selectright: function (e) {
    console.log(e.currentTarget.dataset.city);
    this.setData({
      select3: e.currentTarget.dataset.city
    });
  },
  // 点击灰色背景隐藏所有的筛选内容
  hidebg: function (e) {
    this.setData({
      shownavindex: 0,
    })
  },
  // 区域清空筛选项
  quyuEmpty: function () {
    this.setData({
      select1: '',
      select2: '',
      select3: '-1'
    })
  },
  selectEmpty(){
    this.setData({selectCur:0})
  },
  selectconfirm(){
    var that = this;
    console.log(this.data.selectCur)
    this.setData({show:false})
    if(this.data.setData!=0){
      this.setData({isCharge:this.data.selectCur-1});
    }
    wx.request({
      url: host +'getRecommendInterviewOrderVedio.json?beginNum=0&pageSize=3&cityId=&industryId=&positionId=&isCharge='+that.data.isCharge+'&timeType=&keyWords=',
      success(res){
        console.log(res.data)
        that.setData({
          orderList:res.data.dataList
        })
      }
    })
    
  },
  // 区域选择筛选项后，点击提交
  submitFilter: function () {
    console.log('选择的一级选项是：' + this.data.select1);
    console.log('选择的二级选项是：' + this.data.select2);
    console.log('选择的三级选项是：' + this.data.select3);
    // 隐藏区域下拉框
    this.setData({
      shownavindex: 0
    })
  },
  changeCur(e) {
    this.setData({ barCur: e.currentTarget.dataset.id })
    console.log(this.data.barCur);
    this.setData({ flag: true })
    this.setData({ words: this.data.hotwords[this.data.barCur] })
  },
  selectCur(e) {
    this.setData({ selectCur: e.currentTarget.dataset.id })
    console.log(this.data.selectCur);
  
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
  goOrderDesc(e) {
    var orderId = e.currentTarget.dataset.id;
    console.log(orderId)
    wx.navigateTo({
      url: '/pages/orderDesc/orderDesc?orderId=' + orderId,
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
  getAbout() {
    var that = this;
    wx.request({
      url: host+'getRecommendInterviewOrderVedio.json?beginNum=0&pageSize='+that.data.pageSize+'&cityId='+that.data.cityId+'&industryId='+that.data.industryId+'&positionId='+that.data.positionId+'&isCharge='+that.data.isCharge+'&timeType=&keyWords='+that.data.words,
      success(res) {
        that.setData({ orderList: res.data.dataList })
      }
    })
  },
  detail(e) {
    console.log(e.detail);
    this.setData({show:false})
    wx.request({
      url: host +'getRecommendInterviewOrderVedio.json?beginNum=0&pageSize=3&cityId=3&industryId=&positionId=&isCharge=&timeType=&keyWords=',
    })
  },
  getsort(e) {
    var that = this;
    this.setData({ sortsCur: e.currentTarget.dataset.index, cityId: e.currentTarget.dataset.sort,show:false});
    console.log(this.data.sortsCur);
    wx.request({
      url: host + 'getRecommendInterviewOrderVedio.json?beginNum=0&pageSize=' + that.data.pageSize + '&cityId=' + that.data.cityId + '&industryId=' + that.data.industryId + '&positionId=' + that.data.positionId + '&isCharge=' + that.data.isCharge + '&timeType=&keyWords=' + that.data.words,
      success(res) {
        that.setData({ orderList: res.data.dataList })
      }
    })
  },
  showCity(){
    this.setData({tabCur:0,show:!this.data.show,shownavindex:1})
  },
  select(){
    this.setData({ tabCur: 2, show: !this.data.show, shownavindex: 3 })

  },
  job(e) {
    this.setData({ tabCur: 1, show: !this.data.show, shownavindex: 2 })
    if (this.data.qyopen) {
      this.setData({
        shownavindex: 2
      })
    } else {
      this.setData({
        shownavindex: e.currentTarget.dataset.nav
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    this.setData({
      city: City
    })
    this.getAbout();
    this.swiper();
    if (options) {
      console.log(options)
      // var words = options.keywords;
      // this.setData({words:options.keywords})
      // 发送请求根据用户搜索的关键词给出数据
    }
    wx.request({
      url: host +'querySysCityList.json',
      success(res){
        console.log(res.data)
        that.setData({sorts:res.data})
      }
    })

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
    this.getAbout();

  },
 
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  
})