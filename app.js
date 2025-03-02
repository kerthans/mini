//app.js
import config from './config';
import page from './utils/page';

App({
    onLaunch: function() {
      wx.setStorageSync("config", config);
        Page = page;
    },
    globalData: {
      auth: {  // 初始化 auth 对象
        showModal: false,
        session: null
      },
      showAuthModal: false,     // 明确授权弹窗状态
      authResolver: null        // 明确授权回调
    },
    /**
     * 清除本地令牌和用户信息
     */
    removeAuthToken: function() {
      wx.removeStorageSync(TOKEN_KEY);
      wx.removeStorageSync(USER_INFO_KEY);
    }
})