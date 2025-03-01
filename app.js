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
      }
    },

})