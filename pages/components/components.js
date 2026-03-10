
// pages/components/components.js
Page({
  data: {
    // 组件页面的数据
    componentList: [
      { name: '基础组件', icon: 'icon-basic', desc: '包含基础UI组件' },
      { name: '表单组件', icon: 'icon-form', desc: '包含各类表单元素' },
      { name: '操作反馈', icon: 'icon-feedback', desc: '操作后的反馈组件' },
      { name: '导航组件', icon: 'icon-nav', desc: '导航相关组件' }
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

  onComponentTap: function(e) {
    const index = e.currentTarget.dataset.index;
    const component = this.data.componentList[index];
    wx.showToast({
      title: `你点击了${component.name}`,
      icon: 'none'
    });
  }
})