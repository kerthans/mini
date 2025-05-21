// pages/base_management_work_page/base_management_work_page.js
const token = wx.getStorageSync('auth_token');

Page({
  data: {
    level: 2 // 默认权限级别，需根据接口动态更新
  },
  
  onLoad() {
    // 这里模拟从后端获取权限级别
    this.fetchUserRole();
  },

  handlerGobackClick() {
    wx.showModal({
      title: '你点击了返回',
      content: '是否确认放回',
      success: e => {
        if (e.confirm) {
          const pages = getCurrentPages();
          if (pages.length >= 2) {
            wx.navigateBack({
              delta: 1
            });
          } else {
            wx.reLaunch({
              url: '/pages/index/index'
            });
          }
        }
      }
    });
  },
  handlerGohomeClick() {
    wx.reLaunch({
      url: '/pages/index/index'
    });
  },

  // 示例：获取用户权限
  fetchUserRole() {
    // 发起网络请求
    wx.request({
      url: config.profile_url,
      method: 'GET',
      header: {
        'Authorization': `Bearer ${token}`,
        'content-type': 'application/json'
      },
      success: (res) => {
        this.setData({ role: res.data.data.role })
      },
      fail: () => {
        wx.showToast({ title: '获取权限失败' })
      }
    })
  }
})

