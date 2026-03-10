Page({
  data: {
    images: [],
    currentIndex: 0,
    showControls: true
  },

  onLoad: function(options) {
    const page = getCurrentPages()[getCurrentPages().length - 2];
    const images = page.data.wallpapers;
    const currentIndex = parseInt(options.index || 0);
    
    this.setData({
      images: images,
      currentIndex: currentIndex
    });
  },

  onShow: function() {
    // 设置状态栏为透明
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: '#000000'
    });
  },

  onReady: function() {
    const systemInfo = wx.getSystemInfoSync();
    // 设置全屏
    this.setData({
      statusBarHeight: systemInfo.statusBarHeight,
      screenHeight: systemInfo.screenHeight,
      screenWidth: systemInfo.screenWidth
    });
  },

  handleSwiperChange: function(e) {
    this.setData({
      currentIndex: e.detail.current
    });
  },

  toggleControls: function() {
    this.setData({
      showControls: !this.data.showControls
    });
  },

  goBack: function() {
    wx.navigateBack();
  },

  downloadImage: function() {
    if (!this.data.images || !this.data.images[this.data.currentIndex]) {
      wx.showToast({
        title: '图片数据错误',
        icon: 'none'
      });
      return;
    }
    
    const imageUrl = this.data.images[this.data.currentIndex].url;
    
    // 先检查权限
    wx.getSetting({
      success: (res) => {
        if (!res.authSetting['scope.writePhotosAlbum']) {
          // 如果没有权限，请求权限
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success: () => {
              this.startDownload(imageUrl);
            },
            fail: () => {
              wx.showModal({
                title: '提示',
                content: '需要您授权保存图片到相册',
                showCancel: false,
                success: () => {
                  wx.openSetting();
                }
              });
            }
          });
        } else {
          // 有权限，直接下载
          this.startDownload(imageUrl);
        }
      },
      fail: (err) => {
        console.error('获取权限失败:', err);
        wx.showToast({
          title: '获取权限失败',
          icon: 'none'
        });
      }
    });
  },

  startDownload: function(imageUrl) {
    if (!imageUrl) {
      wx.showToast({
        title: '图片地址错误',
        icon: 'none'
      });
      return;
    }

    wx.showLoading({
      title: '下载中...',
      mask: true
    });

    wx.downloadFile({
      url: imageUrl,
      timeout: 30000,
      success: (res) => {
        if (res.statusCode === 200) {
          wx.saveImageToPhotosAlbum({
            filePath: res.tempFilePath,
            success: () => {
              wx.showToast({
                title: '保存成功',
                icon: 'success'
              });
            },
            fail: (err) => {
              console.error('保存失败:', err);
              wx.showModal({
                title: '保存失败',
                content: '请检查相册权限或重试',
                showCancel: false
              });
            }
          });
        } else {
          wx.showModal({
            title: '下载失败',
            content: '图片下载失败，请重试',
            showCancel: false
          });
        }
      },
      fail: (error) => {
        console.error('下载失败:', error);
        wx.showModal({
          title: '下载失败',
          content: error.errMsg.includes('timeout') ? '网络较慢，请重试' : '请检查网络后重试',
          showCancel: false
        });
      },
      complete: () => {
        wx.hideLoading();
      }
    });
  }
});