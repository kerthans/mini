let authInProgress = false;

const getUserInfo = () => {
  console.log('[Auth] 开始检查授权状态');
  return new Promise((resolve, reject) => {
    if (authInProgress) {
      console.warn('[Auth] 已有授权请求进行中');
      return reject('REQUEST_IN_PROGRESS');
    }
    // authInProgress = true;

    const session = wx.getStorageSync('authSession');
    if (session && Date.now() < session.expiresAt) {
      console.log('[Auth] 发现有效本地会话');
      authInProgress = false;
      return resolve(session);
    }

    console.log('[Auth] 需要重新授权');
    getApp().globalData.showAuthModal = true;
    getApp().globalData.authResolver = { resolve, reject };
  });
}

const handleUserAuth = (confirmed) => {
  console.log('[Auth] 用户授权选择:', confirmed);
  authInProgress = false;
  
  if (!confirmed) {
    console.log('[Auth] 用户拒绝授权');
    getApp().globalData.authResolver?.reject('USER_DENIED');
    return;
  }

  console.log('[Auth] 开始执行wx.login');
  wx.login({
    success: (res) => {
      if (res.code) {
        console.log('[Auth] 获取code成功:', res.code);
        wx.request({
          url: 'YOUR_API_URL',
          method: 'POST',
          data: { code: res.code },
          success: (response) => {
            console.log('[Auth] 后端响应:', response.data);
            if (response.data?.openid) {
              const session = {
                openid: response.data.openid,
                expiresAt: Date.now() + (response.data.expires_in || 7200) * 1000
              };
              console.log('[Auth] 存储会话:', session);
              wx.setStorageSync('authSession', session);
              getApp().globalData.authResolver?.resolve(session.openid);
            } else {
              console.error('[Auth] 无效的响应数据');
              getApp().globalData.authResolver?.reject('INVALID_RESPONSE');
            }
          },
          fail: (err) => {
            console.error('[Auth] 请求后端失败:', err);
            getApp().globalData.authResolver?.reject('NETWORK_ERROR');
          }
        });
      } else {
        console.error('[Auth] wx.login失败:', res.errMsg);
        getApp().globalData.authResolver?.reject('LOGIN_FAILED');
      }
    },
    fail: (err) => {
      console.error('[Auth] wx.login异常:', err);
      getApp().globalData.authResolver?.reject('LOGIN_ERROR');
    }
  });
}

module.exports = {
  getUserInfo: getUserInfo,
  handleUserAuth: handleUserAuth
}