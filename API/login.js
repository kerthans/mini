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
 * 清除本地令牌和用户信息
 */
function removeAuthToken() {
  wx.removeStorageSync(TOKEN_KEY);
  wx.removeStorageSync(USER_INFO_KEY);
}

/**
 * 检查令牌有效性
 * 1. 如果本地存在令牌，则调用后端验证接口（验证 200 表示有效，401 表示失效）
 * 2. 如果本地无令牌或验证失败，则触发授权流程
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
      console.log('[Auth] 发现本地令牌，尝试验证有效性，token =', token);
      validateToken(token)
        .then((res) => {
          console.log('[Auth] 令牌验证通过，res =', res);
          authInProgress = false;
          resolve(token);
        })
        .catch((err) => {
          console.warn('[Auth] 令牌验证失败，错误:', err);
          authInProgress = false;
          // 清除本地令牌后触发授权流程
          removeAuthToken();
          triggerAuthFlow(resolve, reject);
        });
    } else {
      console.log('[Auth] 本地无令牌，需要授权');
      triggerAuthFlow(resolve, reject);
    }
  });
  console.log('[Auth] 返回 Promise 对象:', promise);
  return promise;
};

/**
 * 调用后端接口验证令牌有效性
 * 后端返回 200 表示令牌有效，401 表示令牌失效
 */
const validateToken = (token) => {
  console.log('[Auth] validateToken: 开始验证令牌，token =', token);
  return new Promise((resolve, reject) => {
    wx.request({
      url: 'https://mini.makershub.top/api/validate_token',
      header: { 'Authorization': `Bearer ${token}` },
      success: (res) => {
        console.log('[Auth] validateToken: 请求成功，响应 =', res);
        if (res.statusCode === 200) {
          console.log('[Auth] validateToken: 令牌有效');
          resolve(res.data);
        } else if (res.statusCode === 401) {
          console.warn('[Auth] validateToken: 令牌已失效，状态码:', res.statusCode);
          reject('TOKEN_INVALID');
        } else {
          console.warn('[Auth] validateToken: 令牌验证失败，状态码:', res.statusCode);
          reject('TOKEN_VALIDATION_FAILED');
        }
      },
      fail: (err) => {
        console.error('[Auth] validateToken: 请求失败，错误 =', err);
        reject(err);
      }
    });
  });
};

/**
 * 触发授权流程
 * 设置全局 authResolver，在用户点击授权组件时调用相应的 resolve/reject
 */
const triggerAuthFlow = (resolve, reject) => {
  console.log('[Auth] triggerAuthFlow: 开始触发授权流程');
  const app = getApp();
  app.globalData.showAuthModal = true;
  console.log('[Auth] triggerAuthFlow: 设置 globalData.showAuthModal = true');
  app.globalData.authResolver = {
    resolve: (token) => {
      console.log('[Auth] triggerAuthFlow: 用户授权成功，token =', token);
      authInProgress = false;
      storeAuthToken(token);
      resolve(token);
    },
    reject: (err) => {
      console.warn('[Auth] triggerAuthFlow: 用户授权失败，错误 =', err);
      authInProgress = false;
      reject(err);
    }
  };
  console.log('[Auth] triggerAuthFlow: 已设置全局 authResolver =', app.globalData.authResolver);
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
        url: 'https://mini.makershub.top/api/login',
        method: 'POST',
        data: { code: res.code },
        success: (response) => {
          console.log('[Auth] 后端响应:', response.data);
          if (response.data.code === 200) {
            const token = response.data.auth_token;
            console.log('[Auth] 后端返回令牌，token =', token);
            if (getApp().globalData.authResolver) {
              getApp().globalData.authResolver.resolve(token);
            }
            wx.reLaunch({ url: '/pages/index/index' });
          } else {
            console.warn('[Auth] 后端返回错误代码:', response.data.code);
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
