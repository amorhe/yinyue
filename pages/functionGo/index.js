// pages/functionGo/index.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    audioList:{},
    isPlay:false,
    content:'',
    courceImg:'',
    title:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 设置导航栏标题
    wx.setNavigationBarTitle({title:options.title });
    this.setData({
      title:options.title
    })
    this.audioCtx = wx.createInnerAudioContext();
    this.audioCtx.autoplay = true;
    switch(options.type) {
      case '1':
        this.listen(options.id);
        break;
      case '2':
        this.teachers(options.id)
        break;
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
    
  },
  // 听
  listen(id){
    app.appRequest('get','/index.php/Index/Index/listen_pianduan',{id:id},(res) => {
      console.log(res)
      this.setData({
        audioList:res
      })
      this.play('listen');
      this.audioCtx.onEnded(() => {
        this.pause();
      })
    })
  },
  // 名师讲解
  teachers(id){
    app.appRequest('get','/index.php/Index/Index/teacher_listen',{id,id},(res)=> {
      this.setData({
        audioList: res
      })
      this.play('teachers');
      this.audioCtx.onEnded(() => {
        this.pause();
      })
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  // 暂停播放
  pause(){
    this.audioCtx.pause();
    this.setData({
      isPlay: true
    })
  },
  // 继续播放
  play(type){
    if(type == 'listen'){
      this.audioCtx.src = app.globalData.mainUrl + this.data.audioList.keywords;
      this.audioCtx.src = app.globalData.mainUrl + this.data.audioList.description;  
    }
    if(type == 'teachers'){
      this.audioCtx.src = app.globalData.mainUrl + this.data.audioList.music;
      this.audioCtx.src = app.globalData.mainUrl + this.data.audioList.teacher_listen;
    }
    this.audioCtx.play();
    this.setData({
      isPlay: false,
      content: this.data.audioList.content,
      courceImg:app.globalData.mainUrl + this.data.audioList.image
    })
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
    this.audioCtx.destroy();
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
    return {
      title: this.data.title,
      imageUrl: this.data.courceImg,
      path: '/pages/index/index'
    }
  }
})