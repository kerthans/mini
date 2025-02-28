// utils/api.js (建议的独立接口文件路径)
// const app = getApp()

/**
 * 通用用户数据获取方法
 * @param {Object} page 页面实例对象
 * @param {Function} successCallback 成功回调
 * @param {Function} failCallback 失败回调
 */
function fetchUserData(page, successCallback, failCallback) {
  // 统一凭证校验
  const authToken = wx.getStorageSync('auth_token')
  if (!authToken) {
    wx.showToast({ title: '请重新登录', icon: 'none' })
    wx.redirectTo({ url: '/pages/login/login' })
    return
  }

  wx.showLoading({ title: '加载中...' })

  wx.request({
    url: 'https://mini.makershub.top/api/users/profile',
    header: {
      "Authorization": `Bearer ${authToken}`,
      "Content-Type": "application/json"
    },
    method: 'GET',
    success: (res) => {
      wx.hideLoading()
      
      if (res.statusCode === 200 && res.data.code === 200) {
        // 通用数据处理
        const { username, phone_num, score, role } = res.data.data
        
        // 自动更新页面数据
        page.setData({
          'userInfo.username': username,
          'userInfo.phone_num': phone_num,
          'userInfo.score': score,
          'userInfo.role': role
        })

        // 执行自定义成功逻辑
        successCallback && successCallback(res.data)
      } else {
        // 统一错误处理
        this.handleError(res, page, failCallback)
      }
    },
    fail: (err) => {
      wx.hideLoading()
      failCallback && failCallback(err)
      wx.showToast({ title: '网络连接失败', icon: 'none' })
    }
  })
}

/**
 * 统一错误处理方法
 */
function handleError(res, page, callback) {
  const errorMap = {
    401: () => {
      wx.removeStorageSync('auth_token')
      page.redirectTo({ url: '/pages/login/login' })
    },
    403: () => {
      wx.showToast({ title: '无访问权限', icon: 'none' })
    }
  }

  const handler = errorMap[res.statusCode] || (() => {
    wx.showToast({ title: res.data.message || '请求失败', icon: 'none' })
  })
  
  handler()
  callback && callback(res)
}

// 模块导出
module.exports = {
  fetchUserData,
  handleError
}
