// pages/activity/activity.js
Page({
  data: {
    // 初始化格式化的时间对象
    formattedStartTime: { year: '年', month: '月', day: '日', hour: '时', minute: '分' },
    formattedEndTime: { year: '年', month: '月', day: '日', hour: '时', minute: '分' },
    formattedDeadline: { year: '年', month: '月', day: '日', hour: '时', minute: '分' },
    event_name: '',
    poster: '',
    description: '',
    location: '',
    link: '',
    years: Array.from({ length: 100 }, (_, i) => 2024 + i),
    months: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
    days: Array.from({ length: 31 }, (_, i) => i + 1),
    hours: Array.from({ length: 24 }, (_, i) => i + 1),
    minutes: Array.from({ length: 59 }, (_, i) => i + 1),
    startTimeYear: "年",
    startTimeMonth: "月",
    startTimeDay: "日",
    startTimeHour: "时",
    startTimeMinute: "分",
    endTimeYear: "年",
    endTimeMonth: "月",
    endTimeDay: "日",
    endTimeHour: "时",
    endTimeMinute: "分",
    deadlineYear: "年",
    deadlineMonth: "月",
    deadlineDay: "日",
    deadlineHour: "时",
    deadlineMinute: "分",
    start_time:"",
    end_time:"",
    registration_deadline:"",

    screenWidth: 0,
    screenHeight: 0,
    layoutStyle: '',
    isNameFocused: false,
    isDescriptionFocused: false,
    isLocationFocused: false,
    isLinkFocused: false
  },

  onLoad() {
    // 页面加载时的逻辑
   
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

  onDescriptionFocused : function() {
    this.setData({
      isDescriptionFocused: true
    });
  },

  onDescriptionBlur : function() {
    this.setData({
      isDescriptionFocused: false
    });
  },

  onLocationFocused : function() {
    this.setData({
      isLocationFocused: true
    });
  },

  onLocationBlur : function() {
    this.setData({
      isLocationFocused: false
    });
  },

  onLinkFocused : function() {
    this.setData({
      isLinkFocused: true
    });
  },

  onLinkBlur : function() {
    this.setData({
      isLinkFocused: false
    });
  },

  onInput(e) {
    const field = e.currentTarget.dataset.field;
    this.setData({
      [field]: e.detail.value,
    });
  },//输入函数

  onUploadPoster() {//图片上传函数
    const that = this;
    wx.chooseImage({
      count: 1,
      success(res) {
        const tempFilePaths = res.tempFilePaths;
        that.setData({
          poster: tempFilePaths[0],
        });
      },
    });
  },

  // 时间格式化方法
  updateFormattedTime(type) {
    const data = {
      [`formatted${type.replace(/^\w/, c => c.toUpperCase())}`]: {
        year: this.data[`${type}Year`] ? this.data[`${type}Year`].toString().replace('年', '') + '年' : '年',
        month: this.data[`${type}Month`] ? this.data[`${type}Month`].replace('月','') + '月' : '月',
        day: this.data[`${type}Day`] ? this.data[`${type}Day`].toString().replace('日', '') + '日' : '日',
        hour: this.data[`${type}Hour`] ? this.data[`${type}Hour`].toString().replace('时', '') + '时' : '时',
        minute: this.data[`${type}Minute`] ? this.data[`${type}Minute`].toString().replace('分', '') + '分' : '分'
      }
    };
    this.setData(data);
  },

    // 时间处理统一方法
    formatTime(type) {
      const formatUnit = (value) => value.toString().replace(/[^0-9]/g, '').padStart(2, '0');
      
      const timeData = {
        year: this.data[`${type}Year`],
        month: this.data[`${type}Month`],
        day: this.data[`${type}Day`],
        hour: this.data[`${type}Hour`],
        minute: this.data[`${type}Minute`]
      };
  
      return {
        iso: `${timeData.year}-${formatUnit(timeData.month)}-${formatUnit(timeData.day)} ` +
             `${formatUnit(timeData.hour)}:${formatUnit(timeData.minute)}:00`,
        display: `${timeData.year}年${timeData.month}${timeData.day}日 ` +
                 `${timeData.hour}时${timeData.minute}分`
      };
    },

      // 时间选择事件示例
    onYearChange(e) {
      const type = e.currentTarget.dataset.type;
      const value = this.data.years[e.detail.value];
      this.setData({
        [`${type}Year`]: value
      }, () => {
        this.updateFormattedTime(type);
      });
    },

        // 月份选择
    onMonthChange(e) {
      const type = e.currentTarget.dataset.type;
      const value = this.data.months[e.detail.value];
      this.setData({
        [`${type}Month`]: value
      }, () => {
        this.updateFormattedTime(type);
      });
    },

    // 日期选择
    onDayChange(e) {
      const type = e.currentTarget.dataset.type;
      const value = this.data.days[e.detail.value];
      this.setData({
        [`${type}Day`]: value
      }, () => {
        this.updateFormattedTime(type);
      });
    },

    // 小时选择
    onHourChange(e) {
      const type = e.currentTarget.dataset.type;
      const value = this.data.hours[e.detail.value];
      this.setData({
        [`${type}Hour`]: value
      }, () => {
        this.updateFormattedTime(type);
      });
    },

    // 分钟选择
    onMinuteChange(e) {
      const type = e.currentTarget.dataset.type;
      const value = this.data.minutes[e.detail.value];
      this.setData({
        [`${type}Minute`]: value
      }, () => {
        this.updateFormattedTime(type);
      });
    },

    onSubmit() {
      const app = this;
      
      // 表单验证逻辑
      if (!this.data.event_name || 
          !this.data.poster || 
          !this.data.description || 
          !this.data.location || 
          !this.data.link) {
        return wx.showToast({ title: '请填写完整信息', icon: 'none' });
      }
    
      // 时间验证
      ['startTime', 'endTime', 'deadline'].forEach(type => {
        if (!this.data[`${type}Year`] || 
            !this.data[`${type}Month`] || 
            !this.data[`${type}Day`]) {
          wx.showToast({ title: `请选择完整${type === 'deadline' ? '报名' : ''}时间`, icon: 'none' });
          throw new Error('Validation failed');
        }
      });
    
      // 构造请求数据
      const postData = {
        event_name: this.data.event_name,
        poster: this.data.poster,
        description: this.data.description,
        location: this.data.location,
        link: this.data.link,
        start_time: this.formatTime('startTime').iso,
        end_time: this.formatTime('endTime').iso,
        registration_deadline: this.formatTime('deadline').iso
      };
    
      // 发送请求
      wx.request({
        url: 'https://your-backend-api.com/save',
        method: 'POST',
        header: { 'Content-Type': 'application/json' },
        data: postData,
        success(res) {
          if (res.statusCode === 200) {
            wx.showToast({ title: '发布成功' });
            setTimeout(() => wx.navigateBack(), 1500);
          } else {
            console.error('API错误:', res.data);
            wx.showToast({ title: '服务器处理失败', icon: 'none' });
          }
        },
        fail(error) {
          console.error('网络错误:', error);
          wx.showToast({ title: '网络连接失败', icon: 'none' });
        }
      });
    }    
});