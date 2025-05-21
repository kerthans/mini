//app.js
import config from './config';
import page from './utils/page';

App({
    onLaunch: function() {
        Page = page;
    },
    globalData: {
      auth: {  // 初始化 auth 对象
        showModal: false,
        session: null,
        config: config,
      },
    },
    /**
     * 清除本地令牌和用户信息
     */
    removeAuthToken: function() {
      wx.removeStorageSync(TOKEN_KEY);
      wx.removeStorageSync(USER_INFO_KEY);
    }
})