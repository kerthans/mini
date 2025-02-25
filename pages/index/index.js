// index.js
Page({
  data: {
    activeTab: 'index' // 当前页面为首页
  },

  // 点击底部导航项时调用
  switchPage(e) {
    const target = e.currentTarget.dataset.page;
    if (target === this.data.activeTab) {
      return; // 点击的是当前页面，无需跳转
    }

    let url = '';
    switch (target) {
      case 'community':
        url = '/pages/community/community'; // 社区页面（此处用community页面占位）
        break;
      case 'index':
        url = '/pages/index/index'; // 首页
        break;
      case 'me':
        url = '/pages/me/me'; // 我的页面
        break;
    }

    // 使用 wx.redirectTo 或 wx.reLaunch 进行页面跳转，防止页面堆栈积累
    wx.redirectTo({
      url: url
    });
  },

  navigateToActivity:function() {
    wx.navigateTo({
      url: '/pages/activity_list/activity_list',
      success: () => {
        console.log('成功跳转至活动列表页');
      },
      fail: (err) => {
        console.error('跳转失败:', err);
        wx.showToast({ title: '页面跳转失败', icon: 'none' });
      }
    });
  }
})
