// utils/api.js

// 微信小程序的AppID和Secret
const APPID = 'xxxxxxx'
const SECRET = 'xxxxxxx'

/**
 * 获取微信接口调用凭证access_token
 * @returns {Promise} 返回包含access_token的Promise
 */
function getAccessToken() {
  return new Promise((resolve, reject) => {
    const url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${APPID}&secret=${SECRET}`

    wx.request({
      url: url,
      method: 'GET',
      success: (res) => {
        if (res.data && res.data.access_token) {
          resolve(res.data.access_token)
        } else {
          reject(new Error('获取access_token失败: ' + JSON.stringify(res.data)))
        }
      },
      fail: (err) => {
        reject(new Error('请求access_token失败: ' + JSON.stringify(err)))
      },
    })
  })
}

/**
 * 获取微信公众平台素材列表
 * @param {string} token - 接口调用凭证
 * @param {number} offset - 从全部素材的该偏移位置开始返回，0表示从第一个素材返回
 * @param {number} count - 返回素材的数量，取值在1到20之间
 * @returns {Promise} 返回包含素材列表的Promise
 */
function getWechatMedia(token, offset = 0, count = 20) {
  return new Promise((resolve, reject) => {
    const url = `https://api.weixin.qq.com/cgi-bin/material/batchget_material?access_token=${token}`

    wx.request({
      url: url,
      method: 'POST',
      data: {
        type: 'image',
        offset: offset,
        count: count,
      },
      header: {
        'content-type': 'application/json',
      },
      success: (res) => {
        if (res.statusCode === 200) {
          console.log('获取素材成功:', res.data)
          resolve(res.data)
        } else {
          reject(new Error('获取素材失败: ' + JSON.stringify(res)))
        }
      },
      fail: (err) => {
        reject(new Error('请求素材失败: ' + JSON.stringify(err)))
      },
    })
  })
}

/**
 * 获取壁纸数据（模拟数据，以防微信接口无法正常使用）
 * @returns {Promise} 返回包含壁纸数据的Promise
 */
function getMockWallpapers() {
  return new Promise((resolve) => {
    // 模拟壁纸数据 - 使用已有的图片资源
    const mockData = {
      item_count: 9,
      item: [
        {
          media_id: 'mock_media_id_1',
          name: '壁纸1',
          url: 'images/home.png',
          update_time: Date.now() - 86400000 * 1,
        },
        {
          media_id: 'mock_media_id_2',
          name: '壁纸2',
          url: 'images/home_selected.png',
          update_time: Date.now() - 86400000 * 2,
        },
        {
          media_id: 'mock_media_id_3',
          name: '壁纸3',
          url: 'images/about.png',
          update_time: Date.now() - 86400000 * 3,
        },
        {
          media_id: 'mock_media_id_4',
          name: '壁纸4',
          url: 'images/about_selected.png',
          update_time: Date.now() - 86400000 * 4,
        },
        {
          media_id: 'mock_media_id_5',
          name: '壁纸5',
          url: 'images/component.png',
          update_time: Date.now() - 86400000 * 5,
        },
        {
          media_id: 'mock_media_id_6',
          name: '壁纸6',
          url: 'images/component_selected.png',
          update_time: Date.now() - 86400000 * 6,
        },
        {
          media_id: 'mock_media_id_7',
          name: '壁纸7',
          url: 'images/home.png',
          update_time: Date.now() - 86400000 * 7,
        },
        {
          media_id: 'mock_media_id_8',
          name: '壁纸8',
          url: 'images/about.png',
          update_time: Date.now() - 86400000 * 8,
        },
        {
          media_id: 'mock_media_id_9',
          name: '壁纸9',
          url: 'images/component.png',
          update_time: Date.now() - 86400000 * 9,
        },
      ],
    }

    // 延迟500ms模拟网络请求
    setTimeout(() => {
      resolve(mockData)
    }, 500)
  })
}

module.exports = {
  getAccessToken,
  getWechatMedia,
  getMockWallpapers,
}
