// pages/record/index.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    audioList: [],
    isRecord: 0,
    num: 0,
    content: '',
    courceImg: '',
    music_url:'',
    title:'',
    id:'',
    isDownLoad:false,
    showCode:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 设置导航栏标题
    wx.setNavigationBarTitle({ title: options.title });
    this.setData({
      title:options.title,
      id:options.id
    })
    this.record(options.id)
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
  // 获取数据
  record(id) {
    app.appRequest('get','/index.php/Index/Index/music',{id:id},(res) => {
      this.setData({
        audioList:res,
        content: res[0].content,
        courceImg: app.globalData.mainUrl + res[0].image
      })
    })
  },
  // 获取背景图片内容
  playBg(){
    let { num } = this.data;
    this.setData({
      content: this.data.audioList[num].content,
      courceImg: app.globalData.mainUrl + this.data.audioList[num].image
    })
  },
  //播放声音
  play(music) {
    this.ad = wx.createInnerAudioContext();
    this.recorderManager = wx.getRecorderManager();
    this.ad.src = app.globalData.mainUrl + music;
    this.ad.play();
  },
  //开始录音的时候
  start() {
    this.play(this.data.audioList[this.data.num].music)
    const options = {
      duration: 15000,//指定录音的时长，单位 ms
      sampleRate: 16000,//采样率
      numberOfChannels: 1,//录音通道数
      encodeBitRate: 96000,//编码码率
      format: 'mp3',//音频格式，有效值 aac/mp3
      frameSize: 50,//指定帧大小，单位 KB
    }
    //开始录音
    this.recorderManager.start(options);
    this.recorderManager.onStart(() => {
      console.log('recorder start')
    });
    //错误回调
    this.recorderManager.onError((res) => {
      console.log(res);
    })
    this.setData({
      isRecord: 1
    })
  },
  //停止录音
  stop() {
    var that = this;
    that.recorderManager.stop();
    that.ad.stop();
    that.setData({
      isRecord: 2
    })
    that.recorderManager.onStop((res) => {
      wx.uploadFile({
        url: app.globalData.mainUrl + '/index.php/Index/Index/record',
        filePath: res.tempFilePath,
        name:'file',
        success:(conf) => {
          wx.showModal({
            title: '录音结束',
            content: '试听录音',
            cancelText:'NO',
            confirmText:'YES',
            success(res){
              if(res.confirm){
                that.play(JSON.parse(conf.data).src);
                that.ad.onEnded(() => {
                  wx.showModal({
                    title: '录音结束',
                    content: '是否保存?',
                    cancelText: '重新录制',
                    confirmText: '保存',
                    success(data) {
                      if (data.confirm) {
                        app.appRequest('get', '/index.php/Index/Index/record_add', {
                          listen_url: JSON.parse(conf.data).src,
                          class_id: that.data.audioList[that.data.num].id
                        }, (obj) => {
                          that.setData({
                            music_url: obj.src,
                            isRecord: 0,
                            isDownLoad:true,
                            showCode:true
                          })
                          that.ad.stop();
                          that.next();
                        })
                      } else if (data.cancel) {
                        app.appRequest('get', '/index.php/Index/Index/record_del', { listen_url: JSON.parse(conf.data).src }, (e) => {
                          that.setData({
                            isRecord: 0
                          })
                
                        })
                      }
                    }
                  })
                  that.ad.destroy();
                })
              } else if (res.cancel){
                wx.showModal({
                  title: '录音结束',
                  content: '是否保存?',
                  cancelText: '重新录制',
                  confirmText: '保存',
                  success(ff) {
                    if (ff.confirm) {
                      app.appRequest('get', '/index.php/Index/Index/record_add', {
                        listen_url: JSON.parse(conf.data).src,
                        class_id: that.data.audioList[that.data.num].id
                      }, (obj) => {
                        that.setData({
                          music_url: obj.src,
                          isRecord: 0,
                          isDownLoad:true,
                          showCode: true
                        })
                        that.ad.stop();
                        that.next();
                      })
                    } else if (ff.cancel) {
                      app.appRequest('get', '/index.php/Index/Index/record_del', { listen_url: JSON.parse(conf.data).src},(e)=>{
                        that.setData({
                          isRecord:0
                        })
                        
                      })
                    }
                  }
                })
              }
            }
          })
          
        }
      })
    })
    
  },
  // 下载
  download() {
    if (this.data.isDownLoad){
      wx.downloadFile({
        url: this.data.music_url, // 仅为示例，并非真实的资源
        success(res) {
          // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
          console.log(res);
        }
      })
    }else{
      wx.showModal({
        title: '下载录音',
        content: '请先保存录音！',
        showCancel: false
      })
    }
    
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
    return {
      title: this.data.title,
      imageUrl: this.data.courceImg,
      path:'/pages/index/index'
      // path: '/pages/record/index?id=' + this.data.id + '&title=' + this.data.title
    }
  }
})