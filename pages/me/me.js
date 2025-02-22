Page({
  data: {
    isAssociationMember: true, // 判断是否是协会成员
    textToCopy: '这是要复制的文本',//用于复制的文本
    userInfo: {
      name: '小 鳄 鱼',          // 用户名
      phone: '',         // 用户电话
      signature: '',     // 个性签名
    },
    userPoints: '49',//用户积分
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
    // 模拟通过 API 获取是否是协会成员
    wx.request({
      url: 'https://your-api-url', // 假设的 API URL
      method: 'GET',
      success: (res) => {
        // 设置用户状态，修正拼写错误
        this.setData({
          isAssociationMember: res.data.isAssociationMember, 
        });
      },
      fail: () => {
        wx.showToast({
          title: '获取协会成员状态失败',
          icon: 'none'
        });
      },
      complete: () => {
        // 可在此处添加统一的清理或提示操作
      }
    });

    // 获取用户信息，包括用户名、电话、个性签名、积分
    this.fetchUserData();
  },

  // 获取用户数据并更新页面内容
  fetchUserData: function () {
    // 发起网络请求获取用户信息
    wx.request({
      url: 'https://your-api-url/userinfo', // 假设的 API URL要替换为实际API
      method: 'GET',// 使用GET请求方法获取数据
      success: (res) => {// 请求成功时的回调函数
        // 检查响应的状态码是否为 200，表示请求成功
        if (res.statusCode === 200) {
          // 从返回的数据中解构出用户的相关信息
          const { name, phone, signature, points } = res.data;
          // 更新页面中的用户信息
          this.setData({
            'userInfo.name': name,// 更新用户的名字
            'userInfo.phone': phone,// 更新用户的电话
            'userInfo.signature': signature,// 更新用户的个性签名
            userPoints: points,// 更新用户的积分
          });
        } else {
          // 如果状态码不是200，显示获取用户信息失败的提示
          wx.showToast({
            title: '获取用户信息失败',
            icon: 'none',// 不显示任何图标，只显示文字
          });
        }
      },
      fail: () => {// 请求失败时的回调函数
        // 网络请求失败时，展示错误提示
        wx.showToast({
          title: '网络请求失败',// 提示内容
          icon: 'none',// 不显示图标
        });
      },
      complete: () => {
        // 可在此处添加统一的清理或提示操作
      }
    });
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
  goToPointsPage: function () {
    this.navigateToPage('/pages/points/points');
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

