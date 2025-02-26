// components/auth-modal/auth-modal.js
Component({
  properties: {
    show: { 
      type: Boolean,
      value: false,
      observer: function(newVal) {
        console.log('[Modal] 弹窗状态变更:', newVal);
      }
    }
  },

  methods: {
    handleConfirm() {
      console.log('[Modal] 用户确认授权');
      this.triggerEvent('confirm');
      // 通知全局处理
      getApp().globalData.authResolver?.resolve(true);
    },

    handleCancel() {
      console.log('[Modal] 用户取消授权');
      this.triggerEvent('cancel');
      // 通知全局处理
      getApp().globalData.authResolver?.reject('USER_CANCEL');
    }
  }
})
