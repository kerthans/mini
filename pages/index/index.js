// index.js
var loginJS = require("../../API/login.js");
Page({
  data: {
    activeTab: 'index', // 当前页面为首页
    showAuthModal: false,
    hasUserInfo: false
  },

  onLoad() {
    console.log('[Page] 初始化授权检查');
    // 初始化时检查本地存储
    const userInfo = wx.getStorageSync('userInfo');
    if (userInfo) {
      console.log('[Auth] 发现本地用户信息');
      this.setData({ hasUserInfo: true });
    }
  },

  // 点击底部导航项时调用
  switchPage(e) {
    const target = e.currentTarget.dataset.page;
    let url = '';
    
    console.log('[Auth] 尝试更换导航栏');
    if (!this.data.hasUserInfo) {
      this.showAuthModal(); // 抽离授权逻辑
    } else {
      if (target === this.data.activeTab) {
        return; // 点击的是当前页面，无需跳转
      }

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
    }

    // 使用 wx.redirectTo 或 wx.reLaunch 进行页面跳转，防止页面堆栈积累
    wx.redirectTo({
      url: url
    });
  },

  // 新增授权弹窗控制
  showAuthModal: function() {
    // 直接调用已有防护机制的 getUserInfo
    loginJS.getUserInfo().catch(err => {
      if (err === 'REQUEST_IN_PROGRESS') {
        console.log('[Auth] 已有授权请求进行中，阻止重复弹窗');
        return;
      }
      
    });
    console.log('[Auth] 显示授权提示');
    wx.showModal({
      title: '授权提示',
      content: '需要您授权才能使用该功能',
      confirmText: '立即授权',
      cancelText: '暂不使用',
      success: (res) => {
        if (res.confirm) {
          loginJS.handleUserAuth(res.confirm);
        } else {
          console.log('[Auth] 用户拒绝授权');
          wx.showToast({ title: '功能需要授权才能使用', icon: 'none' });
        }
      }
    });
  },

  //跳转申请借物的逻辑
  navigateToBorrow: function() {
    console.log('[Auth] 尝试访问功能');
    if (!this.data.hasUserInfo) {
      this.showAuthModal(); // 抽离授权逻辑
    } else {
      this.actuallyNavigateToBorrow();
    }
  },

  actuallyNavigateToBorrow: function() {
    wx.navigateTo({
      url: '/pages',
      success: () => console.log('跳转成功'),
      fail: (err) => {
        console.error('跳转失败:', err);
        wx.showToast({ title: '页面跳转失败', icon: 'none' });
      }
    });
  },

  //跳转申请场地的逻辑
  navigateToVenue: function() {
    console.log('[Auth] 尝试访问功能');
    if (!this.data.hasUserInfo) {
      this.showAuthModal(); // 抽离授权逻辑
    } else {
      this.actuallyNavigateToVenue();
    }
  },

  actuallyNavigateToVenue: function() {
    wx.navigateTo({
      url: '/pages',
      success: () => console.log('跳转成功'),
      fail: (err) => {
        console.error('跳转失败:', err);
        wx.showToast({ title: '页面跳转失败', icon: 'none' });
      }
    });
  },

  //跳转项目立项的逻辑
  navigateToProject: function() {
    console.log('[Auth] 尝试访问功能');
    if (!this.data.hasUserInfo) {
      this.showAuthModal(); // 抽离授权逻辑
    } else {
      this.actuallyNavigateToProject();
    }
  },

  actuallyNavigateToProject: function() {
    wx.navigateTo({
      url: '/pages',
      success: () => console.log('跳转成功'),
      fail: (err) => {
        console.error('跳转失败:', err);
        wx.showToast({ title: '页面跳转失败', icon: 'none' });
      }
    });
  },

  //跳转协会活动的逻辑
  navigateToActivity: function() {
    console.log('[Auth] 尝试访问功能');
    if (!this.data.hasUserInfo) {
      this.showAuthModal(); // 抽离授权逻辑
    } else {
      this.actuallyNavigate();
    }
  },

  actuallyNavigate: function() {
    wx.navigateTo({
      url: '/pages/activity_list/activity_list',
      success: () => console.log('跳转成功'),
      fail: (err) => {
        console.error('跳转失败:', err);
        wx.showToast({ title: '页面跳转失败', icon: 'none' });
      }
    });
  },

  
  //跳转查看项目的逻辑
  navigateToViewProject: function() {
    console.log('[Auth] 尝试访问功能');
    if (!this.data.hasUserInfo) {
      this.showAuthModal(); // 抽离授权逻辑
    } else {
      this.actuallyNavigateToViewProject();
    }
  },

  actuallyNavigateToViewProject: function() {
    wx.navigateTo({
      url: '/pages',
      success: () => console.log('跳转成功'),
      fail: (err) => {
        console.error('跳转失败:', err);
        wx.showToast({ title: '页面跳转失败', icon: 'none' });
      }
    });
  },

  //跳转近期赛事的逻辑
  navigateToEvents: function() {
    console.log('[Auth] 尝试访问功能');
    if (!this.data.hasUserInfo) {
      this.showAuthModal(); // 抽离授权逻辑
    } else {
      this.actuallyNavigateToEvents();
    }
  },

  actuallyNavigateToEvents: function() {
    wx.navigateTo({
      url: '/pages',
      success: () => console.log('跳转成功'),
      fail: (err) => {
        console.error('跳转失败:', err);
        wx.showToast({ title: '页面跳转失败', icon: 'none' });
      }
    });
  },



})
