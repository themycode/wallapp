
// pages/about/about.js
Page({
  data: {
    // 关于页面的数据
    version: '1.0.0',
    developer: '壁纸小程序开发团队',
    email: 'support@wallpaper.example.com',
    features: [
      '海量高清壁纸资源',
      '每日更新精选壁纸',
      '支持壁纸收藏与分享',
      '自定义壁纸分类浏览'
    ]
  },

  onLoad: function (options) {
    // 页面加载时执行
  },

  onReady: function () {
    // 页面初次渲染完成时执行
  },

  onShow: function () {
    // 页面显示时执行
  },

  // 复制邮箱到剪贴板
  copyEmail: function() {
    wx.setClipboardData({
      data: this.data.email,
      success: function() {
        wx.showToast({
          title: '邮箱已复制',
          icon: 'success'
        });
      }
    });
  },

  // 跳转到反馈页面
  goToFeedback: function() {
    wx.showToast({
      title: '反馈功能开发中',
      icon: 'none'
    });
  }
})