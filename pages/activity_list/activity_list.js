// pages/MyPoints/MyPoints.js
Page({
  data: {
    item: 0, // 当前显示的swiper项
    items: [], // 活动列表
    loading: true, // 数据加载状态
    error: null, // 错误信息
    isFolded: true,
    currentSort: 'default', // default/asc/desc
    sortText: '默认',
    posters:[], // 海报
  },

  onLoad: function(options) {
    const userid = options.userid; // 从页面参数中获取 userid
    this.setData({ userid });

    // 设置默认的初始信息
    this.setData({
      items: [
        {
          event_id: 11,
          event_name: "人工智能技术讲座",
          poster: "/images/activitydetail/api.jpg",
          description: "深度学习框架应用实战",
          location: "线上会议厅",
          link: "https://meeting.tech/ai2024",
          start_time: "2024-10-05 14:00",
          end_time: "2024-10-05 17:00",
          registration_deadline: "2024-10-03"
        },
        {
          event_id: 12,
          event_name: "区块链应用研讨会",
          poster: "/images/activitydetail/api.jpg",
          description: "数字货币与智能合约开发",
          location: "创新科技大厦B座",
          link: "https://blockchainlab.com/event",
          start_time: "2024-11-15 09:30",
          end_time: "2024-11-15 16:30",
          registration_deadline: "2024-11-10"
        },
        {
          event_id: 13,
          event_name: "元宇宙技术展览",
          poster: "/images/activitydetail/api.jpg",
          description: "VR/AR设备沉浸式体验",
          location: "数字艺术展览中心",
          link: "https://metaverse-expo.org",
          start_time: "2025-03-08 10:00",
          end_time: "2025-03-10 18:00",
          registration_deadline: "2025-03-01"
        },
        {
          event_id: 14,
          event_name: "量子计算学术论坛",
          poster: "/images/activitydetail/api.jpg",
          description: "量子算法与硬件突破",
          location: "清华大学主楼报告厅",
          link: "https://quantum.tsinghua.cn",
          start_time: "2024-12-20 13:00",
          end_time: "2024-12-22 12:00",
          registration_deadline: "2024-12-15"
        },
        {
          event_id: 15,
          event_name: "网络安全攻防演练",
          poster: "/images/activitydetail/api.jpg",
          description: "企业级安全防护实战",
          location: "网络安全实训基地",
          link: "https://cyberdefense.cn",
          start_time: "2025-02-28 08:00",
          end_time: "2025-03-02 18:00",
          registration_deadline: "2025-02-20"
        }
      ]
    });
    const posters = this.data.items.slice(0, 3).map(item => ({
      id: item.event_id,
      image: item.poster
    }));
    this.setData({ posters });
    // 动态加载图片资源
    this.loadItemImages();
    this.loadHistoryImages();

    // 获取兑换历史记录
    this.getExchangeHistory(userid);
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

  // 将日期字符串从 "2024-02-13 14:30:00" 转换为 "2023.11.13"
  formatDate: function(dateString) {
    const date = new Date(dateString); // 解析日期字符串
    const year = date.getFullYear(); // 获取年份
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // 获取月份，+1 是因为月份从0开始
    const day = date.getDate().toString().padStart(2, '0'); // 获取日期
    return `${year}.${month}.${day}`; // 按照 "年.月.日" 的格式返回
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
      url: `/pages/activitydetail/activitydetail?event_id=${event_id}`,
      success: () => {
        console.log('成功跳转至活动详情页');
      },
      fail: (err) => {
        console.error('跳转失败:', err);
        wx.showToast({ title: '页面跳转失败', icon: 'none' });
      }
    });
  },


// 获取兑换历史记录
getExchangeHistory: function(userid) {
  this.setData({ loading: true }); // 设置加载状态为 true，表示正在加载数据

  // 调用后端接口获取兑换历史
  wx.request({
    url: `https://yourserver.com/api/3d_print/history/${userid}`, // 后端接口地址，需要替换为实际的接口
    method: "GET", // 使用 GET 方法请求数据
    success: (res) => {
      // 检查响应状态码和返回的数据是否符合预期
      if (res.statusCode === 200 && res.data.code === 200) {
        // 过滤并处理返回的记录
        const records = res.data.data.records
          .filter(record => record.state === 1) // 只保留状态为 1 的记录，即审核通过的兑换成功的记录
          .map(record => {
            // 调用 getNameFromApplyId 函数动态设置 serviceName
            const serviceName = this.getNameFromApplyId(record.apply_id);

            // 返回处理后的记录对象
            return {
              apply_id: record.apply_id, // 申请 ID
              name: serviceName, // 使用函数返回值设置 name
              time: this.formatDate(record.created_at), // 调用 formatDate 方法格式化时间
              details: `用量: ${record.quantity}g`,// 打印机: ${record.printer === 1 ? '二基楼B101' : 'i创街'}`, //可添加
              pointsUsed: record.score_change, // 使用的积分
              image: '/assets/points/3d_printer.png' // 默认图片路径
            };
          });

        // 将处理后的记录存储到页面的 data 中
        this.setData({
          history: records, // 更新 history 数据
          loading: false // 设置加载状态为 false，表示加载完成
        });
        
        // 动态加载历史记录的图片
        this.loadHistoryImages();

      } else {
        // 如果接口返回的状态码或数据不符合预期，提示用户
        this.setData({ loading: false }); // 设置加载状态为 false
        wx.showToast({
          title: res.data.message || "获取兑换历史失败，请稍后重试",
          icon: "none"
        });
      }
    },
    fail: (err) => {
      // 如果请求失败，提示用户并记录错误
      console.error("获取兑换历史失败", err);
      this.setData({ loading: false }); // 设置加载状态为 false
      wx.showToast({
        title: "网络请求失败，请检查网络连接",
        icon: "none"
      });
    }
  });
},


  // 动态加载积分兑换选项的图片资源
  loadItemImages: function() {
    const items = this.data.items;
    items.forEach((item,index) => {
      this.getResourceImage(item.id).then((imageUrl) => {
        this.setData({
          [`items[${index}].image`]: imageUrl // 更新图片路径
        });
      }).catch(() => {
        console.warn(`图片加载失败，使用默认图片: ${item.image}`);
      });
      this.setData({
        [`items[${index}].image`]: item.image // 使用默认图片路径
      });
    });
  },

  // 动态加载兑换历史的图片资源,根据index/get数据顺序排列（？）
  loadHistoryImages: function() {
    const history = this.data.history;
    history.forEach((item,index) => {
      this.getResourceImage(item.id).then((imageUrl) => {
        this.setData({
          [`history[${index}].image`]: imageUrl // 更新图片路径
        });
      }).catch(() => {
        console.warn(`图片加载失败，使用默认图片: ${item.image}`);
      });
    });
  },

  // 获取单个资源图片 （用于动态获取）
  getResourceImage: function(id) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `https://yourserver.com/api/resources/get/${id}`, // 图片资源接口
        method: "GET",
        success: (res) => {
          if (res.statusCode === 200 && res.data.code === 200) {
        
            /*如果后端传来的data64不完整:
            const base64Data = res.data.data.data; // 获取 Base64 编码的图片数据
            const mimeType = res.data.data.filetype; // 获取图片的 MIME 类型
            resolve(`data:${mimeType};base64,${base64Data}`); // 构造 Base64 图片路径*/  
            const imageUrl = res.data.data.data; // 直接使用后端返回的 Base64 数据
          resolve(imageUrl);
          } else {
            reject(res.data.message || "获取图片失败");
          }
        },
        fail: (err) => {
          console.error("获取图片资源失败", err);
          reject("网络请求失败");
        }
      });
    });
  },

});