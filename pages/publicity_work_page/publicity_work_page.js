// index.js
Page({
  data: {
    level: 2 // 默认权限级别，需根据接口动态更新
  },
  
  onLoad() {
    // 这里模拟从后端获取权限级别
    this.fetchUserLevel()
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

    // 四个导航方法
    // navigate1() {
    //   wx.navigateTo({ url: '/pages/schedule/schedule' }) // 学年工作安排
    // },
    // navigate2() {
    //   wx.navigateTo({ url: '/pages/task/task' }) // 发布任务
    // },
    // navigate3() {
    //   wx.navigateTo({ url: '/pages/promotion/promotion' }) // 活动宣传发布
    // },
    // navigate4() {
    //   wx.navigateTo({ url: '/pages/xiumi/xiumi' }) // 秀米链接提交
    // },


  
  // 示例：获取用户权限
  fetchUserLevel() {
    // 发起网络请求
    wx.request({
      url: 'https://api.example.com/user/info',
      success: (res) => {
        this.setData({ level: res.data.level })
      },
      fail: () => {
        wx.showToast({ title: '获取权限失败' })
      }
    })
  }
})

