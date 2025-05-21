// pages/stuff_borrow/stuff_borrow.js

Page({
  data: {
    task_name: '',
    name: '',
    content: '',
    deadline:'',
    isLeaderNameFocused: false,
    isLeaderPhoneFocused: false,
    isEmailFocused: false,
    isGradeFocused: false,
    isMajorFocused: false,
    isProjectIdFocused: false,
    isAdvisorNameFocused: false,
    isAdvisorPhoneFocused: false,
    array:[0],//默认显示一个
    inputVal:[],//所有input的内容
    categories: ['电子设备','办公用品','其他'],
    namesMap: {
      '电子设备': ['笔记本','摄像头','鼠标'],
      '办公用品': ['笔','本子','订书机'],
      '其他': ['水杯','钥匙扣','文件夹']
    },
    quantitiesMap: {
      '笔记本': ['1台','2台','3台'],
      '摄像头': ['1个','2个','3个'],
      '鼠标': ['1只','2只','3只'],
      '笔': ['1支','5支','10支'],
      '本子': ['1本','2本','5本'],
      '订书机': ['1个','2个','3个'],
      '水杯': ['1个','2个','3个'],
      '钥匙扣': ['1个','2个','3个'],
      '文件夹': ['1个','2个','3个']
    },

    multiArrayList: [],       // 每个条目的三级联动选项数组
    multiIndexList: [],       // 每个条目的当前索引 [i,j,k]
    selectedTextList: [],     // 每个条目的已选文本

    years: Array.from({ length: 100 }, (_, i) => 2024 + i + '年'),
    months: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
    days: Array.from({ length: 31 }, (_, i) => i + 1 + '日'),
    selectedYear: null,
    selectedMonth: null,
    selectedDay: null,

    isDescriptionFocused: false
  },

  onLoad() {
    // 初始化 multiArray 三列
    const firstCol = this.data.categories;
    const secondCol = this.data.namesMap[firstCol[0]];
    const thirdCol = this.data.quantitiesMap[secondCol[0]];
    this.setData({
      multiArrayList: [
        [ firstCol, secondCol, thirdCol ]
      ],
      multiIndexList: [
        [0,0,0]
      ],
      selectedTextList: ['']
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

  // 负责人姓名
  onLeaderNameFocus: function() {
    this.setData({
      isLeaderNameFocused: true
    });
  },
  onLeaderNameBlur: function() {
    this.setData({
      isLeaderNameFocused: false
    });
  },

  // 负责人电话
  onLeaderPhoneFocus: function() {
    this.setData({
      isLeaderPhoneFocused: true
    });
  },
  onLeaderPhoneBlur: function() {
    this.setData({
      isLeaderPhoneFocused: false
    });
  },

  // 邮箱
  onEmailFocus: function() {
    this.setData({
      isEmailFocused: true
    });
  },
  onEmailBlur: function() {
    this.setData({
      isEmailFocused: false
    });
  },

  // 年级
  onGradeFocus: function() {
    this.setData({
      isGradeFocused: true
    });
  },
  onGradeBlur: function() {
    this.setData({
      isGradeFocused: false
    });
  },

  // 负责人专业
  onMajorFocus: function() {
    this.setData({
      isMajorFocused: true
    });
  },
  onMajorBlur: function() {
    this.setData({
      isMajorFocused: false
    });
  },

  // 项目编号
  onProjectIdFocus: function() {
    this.setData({
      isProjectIdFocused: true
    });
  },
  onProjectIdBlur: function() {
    this.setData({
      isProjectIdFocused: false
    });
  },

  // 指导老师姓名
  onAdvisorNameFocus: function() {
    this.setData({
      isAdvisorNameFocused: true
    });
  },
  onAdvisorNameBlur: function() {
    this.setData({
      isAdvisorNameFocused: false
    });
  },

  // 指导老师电话
  onAdvisorPhoneFocus: function() {
    this.setData({
      isAdvisorPhoneFocused: true
    });
  },
  onAdvisorPhoneBlur: function() {
    this.setData({
      isAdvisorPhoneFocused: false
    });
  },
  
  onInput(e) {//编辑函数
    const field = e.currentTarget.dataset.field;
    this.setData({
      [field]: e.detail.value,
    });
  },

  // 用户点击“确认”时触发
  bindMultiPickerChange(e) {
    const idx = e.currentTarget.dataset.idx;
    const [i, j, k] = e.detail.value;
    const arr = this.data.multiArrayList[idx];
    const cat  = arr[0][i];
    const name = arr[1][j];
    const qty  = arr[2][k];
  
    // 更新对应条目的索引和显示文本
    this.setData({
      [`multiIndexList[${idx}]`]: [i, j, k],
      [`selectedTextList[${idx}]`]: `${cat} - ${name} - ${qty}`
    });
  },
  

  // 用户滑动某一列时触发，用来联动后面列的数据
  bindMultiPickerColumnChange(e) {
    const idx = e.currentTarget.dataset.idx;
    const col = e.detail.column;
    const value = e.detail.value;
  
    // 拷贝出要操作的那条 multiArray
    let list = this.data.multiArrayList.slice();
    let sel  = this.data.multiIndexList.slice();
  
    const categories = this.data.categories;
    const namesMap   = this.data.namesMap;
    const quantitiesMap = this.data.quantitiesMap;
  
    let multiArray = list[idx];
    let multiIndex = sel[idx];
  
    if (col === 0) {
      const newCat   = categories[value];
      const newNames = namesMap[newCat];
      const newQtys  = quantitiesMap[newNames[0]];
      multiArray = [ categories, newNames, newQtys ];
      multiIndex = [ value, 0, 0 ];
    }
    else if (col === 1) {
      const cat  = multiArray[0][ multiIndex[0] ];
      const name = multiArray[1][ value ];
      const newQtys = quantitiesMap[name];
      multiArray[1] = namesMap[cat];
      multiArray[2] = newQtys;
      multiIndex[1] = value;
      multiIndex[2] = 0;
    }
  
    // 写回对应条目的数据
    this.setData({
      [`multiArrayList[${idx}]`]: multiArray,
      [`multiIndexList[${idx}]`]: multiIndex
    });
  },
  
  addInput() {
    // 复制第一个条目的初始结构
    const first = this.data.multiArrayList[0];
    this.setData({
      array: [...this.data.array, this.data.array.length],
      multiArrayList: [...this.data.multiArrayList, JSON.parse(JSON.stringify(first))],
      multiIndexList: [...this.data.multiIndexList, [0,0,0]],
      selectedTextList: [...this.data.selectedTextList, '']
    });
  },
  
  delInput(e) {
    const idx = e.currentTarget.dataset.idx;
    const array = this.data.array;
    if (array.length > 1) {
      this.setData({
        array: this.data.array.filter((_,i) => i!==idx),
        multiArrayList: this.data.multiArrayList.filter((_,i) => i!==idx),
        multiIndexList: this.data.multiIndexList.filter((_,i) => i!==idx),
        selectedTextList: this.data.selectedTextList.filter((_,i) => i!==idx),
      });
    }else {
      wx.showToast({
        title: '至少保留一个借用条目',
        icon: 'none',
      });
    }

  },

  onYearChange(e) {//改变选择器年份
    this.setData({
      selectedYear: this.data.years[e.detail.value],
    });
  },

  onMonthChange(e) {//改变选择器月份
    this.setData({
      selectedMonth: this.data.months[e.detail.value],
    });
  },

  onDayChange(e) {//改变选择器日期
    this.setData({
      selectedDay: this.data.days[e.detail.value],
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

  onSubmit() {
    // 显示模态框，提示用户阅读并同意借物规定
    wx.showModal({
      title: '借物规定',
      content: '请阅读并同意借物规定：\r\n1. 借用物品需按时归还；\n2. 严禁转借他人；\n3. 如有损坏，需赔偿；\n\n是否同意以上规定？',
      showCancel: true, // 显示取消按钮
      cancelText: '不同意',
      confirmText: '同意',
      success: (res) => {
        if (res.confirm) {
          // 用户点击了“同意”，执行提交操作
          this.submitForm();
        } else {
          // 用户点击了“不同意”，提示用户
          wx.showToast({
            title: '您必须同意借物规定才能提交',
            icon: 'none',
          });
        }
      },
    });
  },

  // 提交表单的实际操作
  submitForm() {
    const { task_name, name, content, deadline } = this.data;

    if (!task_name || !name || !content || !deadline) {
      wx.showToast({
        title: '请填写完整信息',
        icon: 'none',
      });
      return;
    }

    // 发送请求提交数据
    wx.request({
      url: 'https://example.com/submit', // 替换为实际的提交接口
      method: 'POST',
      data: {
        task_name,
        name,
        content,
        deadline,
      },
      success: (res) => {
        wx.showToast({
          title: '提交成功',
          icon: 'success',
        });
        // 清空表单数据
        this.setData({
          task_name: '',
          name: '',
          content: '',
          deadline: '',
        });
      },
      fail: (err) => {
        wx.showToast({
          title: '提交失败，请稍后重试',
          icon: 'none',
        });
      },
    });
  }
  
});