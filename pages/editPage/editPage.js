// 我的编辑页面
Page({
  // 页面的数据对象，用于存储页面需要展示和使用的数据
  data: {
      // 默认的真实姓名，显示为 '猫猫××'
      realName: '猫猫××',
      // 默认的联系方式，显示为 '1234567890'
      contact: '1234567890',
      // 默认的个人签名，显示为 '不是哥们你'
      signature: '不是哥们你',
      // 用于存储用户头像的 URL
      avatarUrl: '',
      // 真实姓名选中状态
      isNameFocused: false,
      // 联系方式选中状态
      isPhoneFocused: false,
      // 个人签名选中状态
      isMottoFocused: false,
  },

  // 页面加载时触发的生命周期函数
  onLoad: function () {
      // 调用 fetchAvatar 方法，在页面加载时请求用户的头像
      this.fetchAvatar();
  },

  onNameFocused : function() {
    this.setData({
      isNameFocused: true
    });
  },

  onNameBlur : function() {
    this.setData({
      isNameFocused: false
    });
  },

  onPhoneFocused : function() {
    this.setData({
      isPhoneFocused: true
    });
  },

  onPhoneBlur : function() {
    this.setData({
      isPhoneFocused: false
    });
  },

  onMottoFocused : function() {
    this.setData({
      isMottoFocused: true
    });
  },

  onMottoBlur : function() {
    this.setData({
      isMottoFocused: false
    });
  },

  // 向后端请求用户头像 URL 的方法
  fetchAvatar: function () {
      // 调用微信小程序的 wx.request 方法向后端发送请求
      wx.request({
          // 后端接口的地址，需要替换为实际的接口地址
          url: 'https://your-api-endpoint.com/get-avatar',
          // 请求方法为 GET
          method: 'GET',
          // 请求成功时的回调函数
          success: (res) => {
              // 判断响应数据是否存在，并且是否包含 avatarUrl 字段
              if (res.data && res.data.avatarUrl) {
                  // 使用 setData 方法更新页面数据中的 avatarUrl
                  this.setData({
                      avatarUrl: res.data.avatarUrl,
                  });
              } else {
                  // 如果获取失败，显示提示信息
                  wx.showToast({
                      title: '获取头像失败',
                      icon: 'none',
                  });
              }
          },
          // 请求失败时的回调函数
          fail: () => {
              // 显示请求失败的提示信息
              wx.showToast({
                  title: '请求失败，请稍后再试',
                  icon: 'none',
              });
          }
      });
  },

  // 编辑用户头像的方法
  editAvatar: function () {
      // 调用微信小程序的 wx.chooseImage 方法，让用户选择图片
      wx.chooseImage({
          // 允许选择的图片数量为 1 张
          count: 1,
          // 可以选择原图或压缩图
          sizeType: ['original', 'compressed'],
          // 图片来源可以是相册或拍照
          sourceType: ['album', 'camera'],
          // 用户选择图片成功时的回调函数
          success: (res) => {
              // 获取用户选择的图片的临时文件路径
              const tempFilePath = res.tempFilePaths[0];

              // 调用微信小程序的 wx.uploadFile 方法将图片上传到服务器
              wx.uploadFile({
                  // 上传图片的后端接口地址，需要替换为实际的接口地址
                  url: 'https://your-api-endpoint.com/upload-avatar',
                  // 要上传的图片的临时文件路径
                  filePath: tempFilePath,
                  // 后端接收文件的字段名
                  name: 'avatar',
                  // 上传成功时的回调函数
                  success: (uploadRes) => {
                      // 解析后端返回的 JSON 数据
                      const data = JSON.parse(uploadRes.data);
                      // 判断解析后的数据是否存在，并且是否包含 avatarUrl 字段
                      if (data && data.avatarUrl) {
                          // 使用 setData 方法更新页面数据中的 avatarUrl
                          this.setData({
                              avatarUrl: data.avatarUrl,
                          });
                          // 显示头像更新成功的提示信息
                          wx.showToast({
                              title: '头像更新成功',
                              icon: 'success',
                          });
                      } else {
                          // 显示头像更新失败的提示信息
                          wx.showToast({
                              title: '头像更新失败',
                              icon: 'none',
                          });
                      }
                  },
                  // 上传失败时的回调函数
                  fail: () => {
                      // 显示上传失败的提示信息
                      wx.showToast({
                          title: '上传失败，请稍后再试',
                          icon: 'none',
                      });
                  }
              });
          },
          // 用户选择图片失败时的回调函数
          fail: () => {
              // 显示选择图片失败的提示信息
              wx.showToast({
                  title: '选择图片失败，请重试',
                  icon: 'none',
              });
          }
      });
  },

  // 更新真实姓名的方法，接收一个事件对象 e
  updateRealName: function (e) {
      // 使用 setData 方法更新页面数据中的 realName，值为输入框的当前值
      this.setData({
          realName: e.detail.value
      });
  },

  // 更新联系方式的方法，接收一个事件对象 e
  updateContact: function (e) {
      // 使用 setData 方法更新页面数据中的 contact，值为输入框的当前值
      this.setData({
          contact: e.detail.value
      });
  },

  // 更新个人签名的方法，接收一个事件对象 e
  updateSignature: function (e) {
      // 使用 setData 方法更新页面数据中的 signature，值为输入框的当前值
      this.setData({
          signature: e.detail.value
      });
  },

  // 保存用户更改的方法
  saveChanges: function () {
    const { realName, contact, signature } = this.data;
    wx.request({
        url: 'https://your-api-endpoint.com/save-profile', // 替换为实际的保存接口地址
        method: 'POST',
        data: {
            realName,
            contact,
            signature
        },
        success: (res) => {
            if (res.data && res.data.success) {
                wx.showToast({
                    title: '保存成功',
                    icon: 'success',
                    duration: 2000
                });
                setTimeout(() => {
                    wx.navigateBack({
                        delta: 1
                    });
                }, 2000);
            } else {
                wx.showToast({
                    title: '保存失败，请稍后再试',
                    icon: 'none'
                });
            }
        },
        fail: (err) => {
            console.error('保存用户信息失败:', err);
            wx.showToast({
                title: '保存失败，请稍后再试',
                icon: 'none'
            });
        }
    });
},

  // 返回上一页面的方法
  handlerGobackClick() {
      // 调用微信小程序的 wx.navigateBack 方法返回上一页面
      wx.navigateBack({
          delta: 1  // 返回上一页
      });
  },
});
