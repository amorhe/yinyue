// pages/cource_list/index.js
var app = getApp();
var Wxparse = require('../../wxParse/wxParse.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    img:'',
    title:'',
    list:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.id)
    this.getContent(options.id);
    this.getInfo(options.id)
  },
  getContent(id){
    app.appRequest('get','/index.php/Index/Index/detail',{id:id},(res)=>{
      this.setData({
        img: app.globalData.mainUrl + res.thumbnail,
        title:res.title
      })
      if(res.content!=''){
        Wxparse.wxParse('article', 'html', res.content, this, 5);
      }else{
        Wxparse.wxParse('article', 'html', '暂无简介...', this, 5);
      }
    })
  },
  getInfo(id){
    app.appRequest('get','/index.php/Index/Index/listen',{id:id},(res)=> {
      console.log(res)
      for(var i = 0;i < res.length;i ++){
        res[i].image = app.globalData.mainUrl + res[i].image
      }
      this.setData({
        list:res
      })
    })
  },
  godetail(e){
    console.log(e.currentTarget.dataset.id);
    wx.navigateTo({
      url: '/pages/detail/index?id=' + e.currentTarget.dataset.id
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})