const api = require('../../API/me.js')

Page({
  data: {
    isAssociationMember:0, // 判断是否是协会成员
    textToCopy: '这是要复制的文本',//用于复制的文本
    userInfo: {
      username: '小 鳄 鱼',          // 用户名
      phone_num: '',         // 用户电话
      score: '',     // 积分
      role: '' // 用户身份，0是社团外人员，1是干事，2是部长
    },
    // 按钮处理函数映射
    itemHandler: [
      'goToBorrowPage',
      'goToProjectPage',
      'goToVenuePage',
      'goToHonorWallPage'
    ],
    items: ['我的借物','我的项目','我的场地','荣誉墙','协会工作'],
    activeTab: 'me' // 当前页面为我的
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
      url: url,
      fail: () => {
        wx.showToast({
          title: '页面跳转失败',
          icon: 'none'
        });
      },
      complete: () => {
        // 可在此处添加统一的清理或提示操作
      }
    });
  },

  onLoad: function (options) {
    // 获取用户信息，包括用户名、电话、个性签名、积分
    api.fetchUserData(this, 
      (data) => console.log('成功:', data),
      (err) => console.error('失败:', err)
    )
    console.log(this.data.userInfo.role);
    switch(this.data.userInfo.role) {
      case 0:
        isAssociationMember = false;
        break;
      case 1:
        isAssociationMember = true;
        break;
      case 2:
        isAssociationMember = true;
        break;
      default:
        wx.showToast({
          title: '权限异常',
          icon:'error',
        });
        console.log('获取权限异常');
    }
  },

  

  // 复制文本到剪贴板
  copyText: function () {
    // 使用 wx.setClipboardData 方法将指定的文本复制到剪贴板
    wx.setClipboardData({
      data: this.data.textToCopy,// 需要复制的文本，从页面的data中获取
      success: () => {// 复制成功时的回调函数
        // 显示复制成功的提示
        wx.showToast({
          title: '复制成功',// 提示内容
          icon: 'success',// 显示成功图标
          duration: 2000// 提示显示时长，单位为毫秒
        });
      },
      fail: () => {// 复制失败时的回调函数
        // 显示复制失败的提示
        wx.showToast({
          title: '复制失败',// 提示内容
          icon: 'none',// 不显示图标
          duration: 2000// 提示显示时长
        });
      }
    });
  },

  // 封装页面跳转函数
  navigateToPage: function (url) {
    wx.navigateTo({
      url: url,
      fail: () => {
        wx.showToast({
          title: '页面跳转失败',
          icon: 'none'
        });
      },
      complete: () => {
        // 可在此处添加统一的清理或提示操作
      }
    });
  },

  // 页面跳转到编辑页面的函数
  goToEditPage: function () {
    this.navigateToPage('/pages/editPage/editPage');
  },

  // 页面跳转到积分页面的函数
  goToMyPointPage: function () {
    this.navigateToPage('/pages/MyPoints/MyPoints');
  },

  // 页面跳转到借物页面的函数
  goToBorrowPage: function () {
    this.navigateToPage('/pages/borrow/borrow');
  },

  // 页面跳转到项目页面的函数
  goToProjectPage: function () {
    this.navigateToPage('/pages/project/project');
  },

  // 页面跳转到我的场地页面的函数
  goToVenuePage: function () {
    this.navigateToPage('/pages/venue/venue');
  },

  // 页面跳转到协会工作页面的函数
  goToWorkPage: function () {
    this.navigateToPage('/pages/club_work/club_work');
  },

  // 页面跳转到荣誉墙页面的函数
  goToHonorWallPage: function () {
    this.navigateToPage('/pages/honor-wall/honor-wall');
  },

  // 页面跳转到社区页面的函数
  goToCommunityPage: function () {
    this.navigateToPage('/pages/CommunityPage/CommunityPage');
  },
});

