// pages/activity_list/activity_list.js
const UtilJS = require("../../utils/util.js");

Page({
  data: {
    events: [],
    posters:[], // 海报
  },

  onLoad: function(options) {
    // 设置默认的初始信息
    this.loadEvents();
      
    const posters = this.data.items.slice(0, 3).map(item => ({
      id: item.event_id,
      image: item.poster
    }))
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

  // 修改后的切换方法（使用箭头函数绑定this）
  toggleSortDropdown: function() {
    this.setData({
      isFolded: !this.data.isFolded // 取反当前状态
    }, () => {
      console.log('isFolded 状态已更新:', this.data.isFolded)
    })
  },

  // 选择排序方式
  selectSort(e) {
    const value = e.currentTarget.dataset.value;
    let sortText = '默认';
    
    if (value === 'asc') sortText = '正序';
    if (value === 'desc') sortText = '逆序';

    this.setData({
      currentSort: value,
      sortText: sortText,
      isFolded: true
    });

    // 这里触发排序逻辑
    this.doSort(value);
  },

  // 实际排序方法
  doSort(mode) {
    let sortedItems = [...this.data.items];
  
    switch(mode) {
      case 'asc':
        sortedItems.sort((a, b) => 
          new Date(a.start_time.replace(/-/g, '/')) - 
          new Date(b.start_time.replace(/-/g, '/'))
        );
        break;
  
      case 'desc':
        sortedItems.sort((a, b) => 
          new Date(b.start_time.replace(/-/g, '/')) - 
          new Date(a.start_time.replace(/-/g, '/'))
        );
        break;
  
      case 'default':
        // 恢复初始化顺序
        sortedItems = this.data.items.sort((a, b) => a.event_id - b.event_id);
        break;
    }
  
    this.setData({ 
      items: sortedItems 
    }, () => {
      console.log('当前排序结果:', this.data.items.map(i => i.start_time));
    });
  },
  
  navigateToDetail(e) {
    const event_id = e.currentTarget.dataset.eventId;  
    if (!event_id) {
      console.log(event_id);
      wx.showToast({ title: '活动参数错误', icon: 'error' });
      return;
    }
    wx.navigateTo({
      url: `/pages/activitydetail/activitydetail?event_id`+event_id,
      success: () => {
        console.log('成功跳转至活动详情页');
      },
      fail: (err) => {
        console.error('跳转失败:', err);
        wx.showToast({ title: '页面跳转失败', icon: 'none' });
      }
    });
  },

  // 获取事件列表数据
  loadEvents() {
    wx.showLoading({ title: '加载中...' });

    wx.request({
      url: config.list,
      success: (res) => {
        if (res.statusCode === 200) {
          this.setData({
            events: res.data.map(item => ({
              ...item,
              // 转换时间戳（假设API返回的是时间戳）
              start_time: this.formatDate(item.start_time),
              end_time: this.formatDate(item.end_time),
              registration_deadline: this.formatDate(item.registration_deadline)
            }))
          });
        }
      },
      fail: (err) => {
        wx.showToast({ title: '加载失败', icon: 'none' });
      },
      complete: () => wx.hideLoading()
    });
  },

});