Page({
  data: {
    isEditing: false,
    level:1,
    tableData: [
      { script: '许景源', push: '王远航', news: '岳一扬' },
      { script: '岳一扬', push: '许景源', news: '王远航' },
      { script: '王远航', push: '岳一扬', news: '许景源' },
      { script: '陈泓瑶', push: '陈泓瑶', news: '陈泓瑶' },
    ],
    editableRow: null,   // 当前行索引
    editable1CellIndex: null // 当前列索引
    
  },

  onLoad() {
    
    // 页面加载时的逻辑
    wx.request({//页面进入时加载数据
      url: 'url',
      method:'GET',
      data:{
        activity: that.data.tableData.activity,
        push: that.data.tableData.push,
        news:that.data.tableData.news,
        level:that.data.level
      },
      success: function(res) {
        console.log('数据库数据：', res.data);
        that.setData({
          items: res.data // 将获取的数据存储到页面数据中
        });
      },
      fail: function(err) {
        console.error('获取数据失败：', err);
      }
    });
  },

  handlerGobackClick() {
    wx.showModal({
      title: '你点击了返回',
      content: '是否确认放回',
      success: e => {
        if (e.confirm) {
          const pages = getCurrentPages();
          if (pages.length >= 2) {
            wx.navigateBack({
              delta: 1
            });
          } else {
            wx.reLaunch({
              url: '/pages/index/index'
            });
          }
        }
      }
    });
  },
  handlerGohomeClick() {
    wx.reLaunch({
      url: '/pages/index/index'
    });
  },

  // 输入事件处理
  onCellInput(e) {
    const { index, field } = e.currentTarget.dataset;
    const newValue = e.detail.value;
    
    this.setData({
      [`tableData[${index}].${field}`]: newValue
    })
  },

  // 切换编辑模式
  toggleEdit() {
    this.setData({
      isEditing: !this.data.isEditing
    })
  },

  // 提交编辑
  submitEdit: function() {
    wx.showModal({
      title: '提交修改确认',
      content: '学年工作安排被修改，确认提交修改？',
      success: e => {
        if (e.confirm) {
          console.log('提交编辑');
          this.setData({isEditing: false});
        }
        else {
          console.log('取消提交编辑');
        }
      }
    });
    
    wx.request({/*上传修改过后的数据*/
      url: 'https://your-backend-server.com/api/data', // 替换为你的后端 API 地址
      method: 'POST',
      data: {
        activity: that.data.tableData.activity,
        push: that.data.tableData.push,
        news:that.data.tableData.news
      },
      success: function(res) {
        console.log('上传结果：', res.data);
        wx.showToast({
          title: res.data.message,
          icon: 'success'
        });
      },
      fail: function(err) {
        console.error('上传失败：', err);
        wx.showToast({
          title: '上传失败',
          icon: 'none'
        });
      }
    });
  },

  // 取消编辑
  cancelEdit: function() {
    wx.showModal({
      title: '取消修改确认',
      content: '学年工作安排已被修改，取消后修改将会丢失，是否确认取消？',
      success: e => {
        if (e.confirm) {
          console.log('取消编辑');
          this.setData({isEditing: false});
        }
        else {
          console.log('未取消编辑');
        }
      }
    });
  }
});