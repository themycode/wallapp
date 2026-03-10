// pages/index/index.js
const api = require('../../utils/api.js');

Page({
  data: {
    wallpapers: [],
    loading: false,
    currentCategory: '全部',
    categories: ['全部', '风景', '动物', '建筑', '艺术'],
    showPreview: false,
    currentWallpaper: null,
    page: 1,
    hasMore: true
  },

  onLoad: function() {
    this.loadWallpapers();
  },

  onPullDownRefresh: function() {
    this.setData({
      wallpapers: [],
      page: 1,
      hasMore: true
    });
    this.loadWallpapers().then(() => {
      wx.stopPullDownRefresh();
    });
  },

  onReachBottom: function() {
    if (this.data.hasMore && !this.data.loading) {
      this.loadMoreWallpapers();
    }
  },

  // 加载壁纸数据
  loadWallpapers: function() {
    if (this.data.loading) return Promise.resolve();
    
    this.setData({ loading: true });
    
    // 首先获取access_token
    return api.getAccessToken()
      .then(token => {
        // 使用access_token获取微信公众平台素材
        return api.getWechatMedia(token, 0, 20);
      })
      .then(res => {
        console.log('获取到的素材数据:', res);
        
        // 检查是否成功获取到素材
        if (res && res.item && res.item.length > 0) {
          const wallpapers = res.item.map(item => {
            return {
              id: item.media_id,
              name: item.name || '精美壁纸',
              url: item.url,
              updateTime: new Date(item.update_time * 1000).toLocaleDateString(),
              likes: Math.floor(Math.random() * 1000), // 模拟点赞数
              downloads: Math.floor(Math.random() * 5000), // 模拟下载数
              category: this.getRandomCategory() // 随机分配类别
            };
          });
          
          this.setData({
            wallpapers: wallpapers,
            loading: false,
            hasMore: wallpapers.length >= 10 // 如果返回的数据少于10条，认为没有更多数据
          });
        } else {
          // 如果没有获取到素材或发生错误，使用模拟数据
          console.log('未获取到素材数据，使用模拟数据');
          return this.useMockData();
        }
      })
      .catch(err => {
        console.error('加载壁纸失败:', err);
        // 如果API调用失败，使用模拟数据
        console.log('API调用失败，使用模拟数据');
        return this.useMockData();
      });
  },

  // 使用模拟数据
  useMockData: function() {
    console.log('开始加载模拟数据');
    return api.getMockWallpapers()
      .then(res => {
        console.log('获取到模拟数据:', res);
        
        if (!res || !res.item) {
          console.error('模拟数据格式不正确');
          return Promise.reject('模拟数据格式不正确');
        }
        
        console.log('开始处理模拟数据，数量:', res.item.length);
        const wallpapers = res.item.map(item => {
          console.log('处理壁纸项:', item);
          return {
            id: item.media_id,
            name: item.name,
            url: item.url,
            updateTime: new Date(item.update_time).toLocaleDateString(),
            likes: Math.floor(Math.random() * 1000),
            downloads: Math.floor(Math.random() * 5000),
            category: this.getRandomCategory()
          };
        });
        
        console.log('处理后的壁纸数据:', wallpapers);
        this.setData({
          wallpapers: wallpapers,
          loading: false,
          hasMore: wallpapers.length >= 6
        });
        
        // 检查数据是否正确设置
        setTimeout(() => {
          console.log('当前壁纸数据:', this.data.wallpapers);
          if (this.data.wallpapers.length > 0) {
            console.log('第一张壁纸URL:', this.data.wallpapers[0].url);
          }
        }, 100);
      })
      .catch(err => {
        console.error('加载模拟数据失败:', err);
        wx.showToast({
          title: '加载壁纸失败',
          icon: 'none'
        });
        this.setData({ loading: false });
      });
  },

  // 加载更多壁纸
  loadMoreWallpapers: function() {
    if (this.data.loading || !this.data.hasMore) return;
    
    this.setData({ 
      loading: true,
      page: this.data.page + 1
    });
    
    // 首先获取access_token
    api.getAccessToken()
      .then(token => {
        // 使用access_token获取微信公众平台素材，偏移量根据页码计算
        const offset = (this.data.page - 1) * 20;
        return api.getWechatMedia(token, offset, 20);
      })
      .then(res => {
        // 检查是否成功获取到素材
        if (res && res.item && res.item.length > 0) {
          const newWallpapers = res.item.map(item => {
            return {
              id: item.media_id,
              name: item.name || '精美壁纸',
              url: item.url,
              updateTime: new Date(item.update_time * 1000).toLocaleDateString(),
              likes: Math.floor(Math.random() * 1000),
              downloads: Math.floor(Math.random() * 5000),
              category: this.getRandomCategory()
            };
          });
          
          this.setData({
            wallpapers: [...this.data.wallpapers, ...newWallpapers],
            loading: false,
            hasMore: newWallpapers.length >= 10
          });
        } else {
          // 如果没有获取到更多素材，使用模拟数据
          return this.useMoreMockData();
        }
      })
      .catch(err => {
        console.error('加载更多壁纸失败:', err);
        // 如果API调用失败，使用模拟数据
        return this.useMoreMockData();
      });
  },

  // 使用更多模拟数据
  useMoreMockData: function() {
    api.getMockWallpapers()
      .then(res => {
        if (res.item && res.item.length > 0) {
          const newWallpapers = res.item.map(item => {
            return {
              id: item.media_id + '_' + this.data.page, // 添加页码以避免ID重复
              name: item.name,
              url: item.url.replace('random=', 'random=' + this.data.page + '_'),
              updateTime: new Date(item.update_time).toLocaleDateString(),
              likes: Math.floor(Math.random() * 1000),
              downloads: Math.floor(Math.random() * 5000),
              category: this.getRandomCategory()
            };
          });
          
          this.setData({
            wallpapers: [...this.data.wallpapers, ...newWallpapers],
            loading: false,
            hasMore: this.data.page < 3 // 模拟只有3页数据
          });
        } else {
          this.setData({
            loading: false,
            hasMore: false
          });
        }
      })
      .catch(err => {
        console.error('加载更多模拟数据失败:', err);
        wx.showToast({
          title: '加载更多失败',
          icon: 'none'
        });
        this.setData({ loading: false });
      });
  },

  // 随机分配壁纸类别
  getRandomCategory: function() {
    const categories = this.data.categories.slice(1); // 排除"全部"类别
    const randomIndex = Math.floor(Math.random() * categories.length);
    return categories[randomIndex];
  },

  // 切换壁纸类别
  changeCategory: function(e) {
    const category = e.currentTarget.dataset.category;
    this.setData({
      currentCategory: category,
      page: 1
    });
  },

  // 预览壁纸
  previewWallpaper: function(e) {
    const index = e.currentTarget.dataset.index;
    wx.navigateTo({
      url: `/pages/preview/preview?index=${index}`
    });
  },

  // 关闭预览
  closePreview: function() {
    this.setData({
      showPreview: false,
      currentWallpaper: null
    });
  },

  // 下载壁纸
  downloadWallpaper: function() {
    if (!this.data.currentWallpaper) return;
    
    wx.showLoading({
      title: '下载中...',
    });
    
    wx.downloadFile({
      url: this.data.currentWallpaper.url,
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
              wx.showToast({
                title: '保存失败',
                icon: 'none'
              });
            }
          });
        }
      },
      fail: () => {
        wx.showToast({
          title: '下载失败',
          icon: 'none'
        });
      },
      complete: () => {
        wx.hideLoading();
      }
    });
  },

  // 点赞壁纸 (功能已简化，UI中已移除点赞按钮)
  likeWallpaper: function() {
    wx.showToast({
      title: '点赞功能已移除',
      icon: 'none'
    });
  },

  // 分享壁纸
  onShareAppMessage: function() {
    if (this.data.currentWallpaper) {
      return {
        title: '分享一张精美壁纸',
        imageUrl: this.data.currentWallpaper.url,
        path: '/pages/index/index'
      };
    }
    return {
      title: '壁纸小程序 - 精美壁纸分享',
      path: '/pages/index/index'
    };
  }
})