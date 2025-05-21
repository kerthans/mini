// login.js

let authInProgress = false;
const TOKEN_KEY = 'auth_token';
const USER_INFO_KEY = 'userInfo';

/**
 * 获取本地存储的令牌
 */
function getAuthToken() {
  return wx.getStorageSync(TOKEN_KEY);
}

/**
 * 存储令牌到本地缓存
 */
function storeAuthToken(token) {
  wx.setStorageSync(TOKEN_KEY, token);
  wx.setStorageSync(USER_INFO_KEY, { logged: true });
}

/**
 * 检查令牌有效性
 * 如果本地无令牌或验证失败，则触发授权流程
 */
const checkTokenValidity = () => {
  console.log('[Auth] 开始检查授权状态');
  const promise = new Promise((resolve, reject) => {
    if (authInProgress) {
      console.warn('[Auth] 已有授权请求进行中');
      // 此处直接 reject，但 Promise 对象仍然返回
      reject('REQUEST_IN_PROGRESS');
      return;
    }
    authInProgress = true;
    console.log('[Auth] 设置 authInProgress = true');

    const token = getAuthToken();
    if (token) {
      console.log('[Auth] 发现本地令牌，token =', token);
      authInProgress = false;
      resolve(token);
    } else {
      console.log('[Auth] 本地无令牌，需要授权');
      triggerAuthFlow(resolve, reject);
    }
  });
  console.log('[Auth] 返回 Promise 对象:', promise);
  return promise;
};


/**
 * 触发授权流程
 * 设置全局 authResolver，在用户点击授权组件时调用相应的 resolve/reject
 */
const triggerAuthFlow = (resolve, reject) => {
  console.log('[Auth] triggerAuthFlow: 开始触发授权流程');
  // const app = getApp();
  // app.globalData.showAuthModal = true;
  // console.log('[Auth] triggerAuthFlow: 设置 globalData.showAuthModal = true');
  // app.globalData.authResolver = {
  //   resolve: (token) => {
  //     console.log('[Auth] triggerAuthFlow: 用户授权成功，token =', token);
  //     authInProgress = false;
  //     storeAuthToken(token);
  //     resolve(token);
  //   },
  //   reject: (err) => {
  //     console.warn('[Auth] triggerAuthFlow: 用户授权失败，错误 =', err);
  //     authInProgress = false;
  //     reject(err);
  //   }
  // };
  // console.log('[Auth] triggerAuthFlow: 已设置全局 authResolver =', app.globalData.authResolver);
  // 直接显示弹窗
 wx.showModal({
    title: '授权提示',
    content: '需要授权以使用完整功能',
    confirmText: '同意',
    cancelText: '拒绝',
    success: (res) => {
      if (res.confirm) {
        console.log('[Auth] 用户同意授权');
        // 用户同意，继续执行微信登录
        handleUserAuth(true);
      } else {
        console.log('[Auth] 用户拒绝授权');
        authInProgress = false;
        reject('USER_DENIED');
      }
    },
    fail: (err) => {
      console.error('[Auth] 弹窗显示失败:', err);
      authInProgress = false;
      reject('MODAL_ERROR');
    }
  });
};

/**
 * 用户点击授权弹窗后调用
 * 如果用户同意授权，则通过 wx.login 获取 code，再调用后端接口换取令牌
 */
const handleUserAuth = (confirmed) => {
  if (!confirmed) {
    console.log('[Auth] 用户拒绝授权');
    const app = getApp();
    if (app.globalData.authResolver) {
      app.globalData.authResolver.reject('USER_DENIED');
    }
    return;
  }
  console.log('[Auth] 开始执行 wx.login');
  wx.login({
    success: (res) => {
      if (!res.code) {
        console.error('[Auth] wx.login失败:', res.errMsg);
        if (getApp().globalData.authResolver) {
          getApp().globalData.authResolver.reject('LOGIN_FAILED');
        }
        return;
      }
      console.log('[Auth] 获取 code 成功:', res.code);
      wx.request({
        url: 'http://47.109.201.165:8000/api/v1/users/wx-login',
        method: 'POST',
        data: { code: res.code },
        success: (response) => {
          console.log('[Auth] 后端响应:', response.data);
          if (response.statusCode === 200 && response.data.code === 200) {
            const token = response.data.data.token;
            console.log('[Auth] 后端返回令牌，token =', token);
            storeAuthToken(token);
            if (getApp().globalData.authResolver) {
              getApp().globalData.authResolver.resolve(token);
            }
            wx.reLaunch({ url: '/pages/index/index' });
          } else {
            console.warn('[Auth] 后端返回错误代码:', response.data.data.code);
            if (getApp().globalData.authResolver) {
              getApp().globalData.authResolver.reject('LOGIN_FAILED');
            }
          }
        },
        fail: (err) => {
          console.error('[Auth] 请求后端失败:', err);
          if (getApp().globalData.authResolver) {
            getApp().globalData.authResolver.reject('NETWORK_ERROR');
          }
        }
      });
    },
    fail: (err) => {
      console.error('[Auth] wx.login异常:', err);
      if (getApp().globalData.authResolver) {
        getApp().globalData.authResolver.reject('LOGIN_ERROR');
      }
    }
  });
};

module.exports = {
  checkTokenValidity,
  handleUserAuth,
  TOKEN_KEY,
  USER_INFO_KEY,
};
